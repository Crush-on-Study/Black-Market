from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, Listing, Achievement
import os
import json
from dotenv import load_dotenv
from datetime import datetime, timedelta
import logging

# .env 파일 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database URL - 환경변수에서 가져오거나 기본값 사용
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://blackmarket_user:blackmarket_password@localhost:5432/blackmarket")

# SQLite를 사용하고 싶다면 아래 주석을 해제하고 위 라인을 주석처리
# DATABASE_URL = "sqlite:///./blackmarket.db"

# SQLite용 엔진 설정
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    """데이터베이스 테이블 생성"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """데이터베이스 세션 의존성"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def clean_mock_data():
    """기존 목업 데이터를 데이터베이스에서 삭제"""
    logger.info("기존 목업 데이터 삭제를 시작합니다...")
    
    db = SessionLocal()
    try:
        # 목업 데이터로 생성된 사용자들 찾기 (이메일이 @mockdata.example.com으로 끝나는 사용자들)
        mock_users = db.query(User).filter(User.email.like('%@mockdata.example.com')).all()
        mock_user_ids = [user.user_id for user in mock_users]
        
        if mock_user_ids:
            # 목업 사용자들의 리스팅 삭제
            mock_listings = db.query(Listing).filter(Listing.seller_id.in_(mock_user_ids)).all()
            for listing in mock_listings:
                db.delete(listing)
            
            # 목업 사용자들 삭제
            for user in mock_users:
                db.delete(user)
            
            logger.info(f"목업 사용자 {len(mock_users)}명과 관련 리스팅 {len(mock_listings)}개를 삭제했습니다.")
        
        # 목업 업적 삭제 (이름이 [MOCK]으로 시작하는 것들)
        mock_achievements = db.query(Achievement).filter(Achievement.name.like('[MOCK]%')).all()
        
        for achievement in mock_achievements:
            db.delete(achievement)
        
        if mock_achievements:
            logger.info(f"목업 업적 {len(mock_achievements)}개를 삭제했습니다.")
        
        db.commit()
        logger.info("목업 데이터 삭제가 완료되었습니다.")
        
    except Exception as e:
        db.rollback()
        logger.error(f"목업 데이터 삭제 중 오류 발생: {str(e)}")
        raise
    finally:
        db.close()

def load_mock_data():
    """목업 데이터를 데이터베이스에 로드"""
    # 환경변수에서 목업 모드 확인
    use_mock_data = os.getenv("USE_MOCK_DATA", "false").lower() == "true"
    
    if not use_mock_data:
        logger.info("목업 데이터 로드가 비활성화되어 있습니다.")
        # 목업 데이터가 비활성화된 경우 기존 목업 데이터 삭제
        clean_mock_data()
        return
    
    logger.info("목업 데이터 로드를 시작합니다...")
    
    # JSON 파일 경로
    mock_data_path = os.path.join(os.path.dirname(__file__), "mock_data.json")
    
    if not os.path.exists(mock_data_path):
        logger.error(f"목업 데이터 파일을 찾을 수 없습니다: {mock_data_path}")
        return
    
    try:
        # JSON 파일 읽기
        with open(mock_data_path, 'r', encoding='utf-8') as f:
            mock_data = json.load(f)
        
        db = SessionLocal()
        
        try:
            # 기존 데이터 확인 (중복 방지)
            existing_users = db.query(User).count()
            existing_listings = db.query(Listing).count()
            existing_achievements = db.query(Achievement).count()
            
            if existing_users > 0 or existing_listings > 0 or existing_achievements > 0:
                logger.info("기존 데이터가 존재합니다. 목업 데이터 로드를 건너뜁니다.")
                return
            
            # 목업 사용자 생성
            mock_users = {}
            unique_sellers = set()
            
            # 거래 데이터에서 고유한 판매자 추출
            for deal in mock_data.get("deals", []):
                unique_sellers.add(deal["seller"])
            
            # 사용자 생성
            for i, seller in enumerate(unique_sellers, 1):
                user = User(
                    username=seller,
                    email=f"{seller.lower().replace(' ', '').replace('거래자', '').replace('구매희망자', '').replace('대량구매자', '')}@mockdata.example.com",
                    password_hash="$2b$12$dummy_hash_for_mock_data",  # 실제로는 해시된 비밀번호 사용
                    points_balance=1000000,  # 기본 포인트
                    created_at=datetime.now() - timedelta(days=30)
                )
                db.add(user)
                db.flush()  # ID 생성을 위해 flush
                mock_users[seller] = user.user_id
            
            # 리스팅 생성
            for deal in mock_data.get("deals", []):
                seller_id = mock_users.get(deal["seller"])
                if seller_id:
                    listing = Listing(
                        seller_id=seller_id,
                        item_name=deal["title"],
                        item_description=f"포인트 {deal['points']:,}점 {'판매' if deal['type'] == 'sell' else '구매'}",
                        quantity=deal["points"],
                        price_per_unit=deal["price"] / deal["points"],  # 단위당 가격
                        status='active' if deal["status"] == 'selling' else 'completed',
                        created_at=datetime.now() - timedelta(days=7),
                        expires_at=datetime.now() + timedelta(days=7)
                    )
                    db.add(listing)
            
            # 업적 데이터 생성
            for achievement_data in mock_data.get("achievements", []):
                achievement = Achievement(
                    achievement_id=hash(achievement_data["id"]) % 1000000,  # 간단한 ID 생성
                    name=f"[MOCK] {achievement_data['name']}",  # 목업 데이터 표시
                    description=achievement_data["description"],
                    icon_url=achievement_data["icon"]
                )
                db.add(achievement)
            
            # 변경사항 커밋
            db.commit()
            logger.info(f"목업 데이터 로드 완료: 사용자 {len(unique_sellers)}명, 리스팅 {len(mock_data.get('deals', []))}개, 업적 {len(mock_data.get('achievements', []))}개")
            
        except Exception as e:
            db.rollback()
            logger.error(f"목업 데이터 로드 중 오류 발생: {str(e)}")
            raise
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"목업 데이터 파일 읽기 오류: {str(e)}")

def initialize_database():
    """데이터베이스 초기화 (테이블 생성 및 목업 데이터 로드)"""
    logger.info("데이터베이스 초기화를 시작합니다...")
    
    # 테이블 생성
    create_tables()
    
    # 목업 데이터 로드
    load_mock_data()
    
    logger.info("데이터베이스 초기화가 완료되었습니다.")