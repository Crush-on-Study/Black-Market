import jwt
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict
from fastapi import HTTPException
import os

# JWT 설정
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
VERIFICATION_TOKEN_EXPIRE_MINUTES = 30
ACCESS_TOKEN_EXPIRE_MINUTES = 20  # 20분
REFRESH_TOKEN_EXPIRE_DAYS = 14  # 2주

def create_verification_token(verification_id: int, email: str) -> str:
    """이메일 인증 완료 후 사용자 설정을 위한 임시 토큰 생성"""
    payload = {
        "verification_id": verification_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(minutes=VERIFICATION_TOKEN_EXPIRE_MINUTES),
        "type": "email_verification",
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_verification_token(token: str) -> Dict:
    """인증 토큰 검증 및 페이로드 반환"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # 토큰 타입 확인
        if payload.get("type") != "email_verification":
            raise HTTPException(status_code=400, detail="잘못된 토큰 타입입니다")
        
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="토큰이 만료되었습니다. 이메일 인증을 다시 진행해주세요")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="유효하지 않은 토큰입니다")

def create_access_token(user_id: int, email: str, expire_minutes: Optional[int] = None) -> str:
    """사용자 로그인용 액세스 토큰 생성"""
    if expire_minutes is None:
        expire_minutes = ACCESS_TOKEN_EXPIRE_MINUTES
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(minutes=expire_minutes),
        "type": "access_token",
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token() -> str:
    """리프레시 토큰 생성 (랜덤 문자열)"""
    return secrets.token_urlsafe(32)

def hash_refresh_token(token: str) -> str:
    """리프레시 토큰 해시화"""
    return hashlib.sha256(token.encode()).hexdigest()

def verify_access_token(token: str) -> Dict:
    """액세스 토큰 검증 및 페이로드 반환"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # 토큰 타입 확인
        if payload.get("type") != "access_token":
            raise HTTPException(status_code=401, detail="잘못된 토큰 타입입니다")
        
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="토큰이 만료되었습니다. 리프레시 토큰을 사용해주세요")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다")