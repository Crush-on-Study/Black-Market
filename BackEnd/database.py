from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# Database URL - 환경변수에서 가져오거나 기본값 사용
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://blackmarket_user:blackmarket_password@localhost:5432/blackmarket")

# SQLite를 사용하고 싶다면 아래 주석을 해제하고 위 라인을 주석처리
# DATABASE_URL = "sqlite:///./blackmarket.db"

# Lambda 환경 감지
IS_LAMBDA = os.getenv("AWS_LAMBDA_FUNCTION_NAME") is not None

# 엔진 설정
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Lambda 환경에서는 연결 풀 크기를 줄이고 RDS 최적화 설정 적용
    if IS_LAMBDA:
        engine = create_engine(
            DATABASE_URL,
            pool_size=1,                    # Lambda는 단일 연결만 사용
            max_overflow=0,                 # 추가 연결 생성 방지
            pool_pre_ping=True,             # 연결 상태 확인
            pool_recycle=300,               # 5분마다 연결 재생성
            connect_args={
                "connect_timeout": 10,      # 연결 타임아웃 10초
                "application_name": "black-market-lambda"  # 연결 식별용
            }
        )
    else:
        # 로컬 개발 환경용 설정
        engine = create_engine(
            DATABASE_URL,
            pool_size=5,
            max_overflow=10,
            pool_pre_ping=True,
            pool_recycle=3600
        )
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