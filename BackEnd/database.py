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