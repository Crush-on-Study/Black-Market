from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from auth_utils import verify_access_token
from database import get_db
import crud

# HTTP Bearer 토큰 스키마
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    JWT 토큰을 검증하고 현재 사용자 정보를 반환합니다.
    
    Args:
        credentials: HTTP Authorization 헤더의 Bearer 토큰
        db: 데이터베이스 세션
    
    Returns:
        User: 현재 로그인한 사용자 객체
    
    Raises:
        HTTPException: 토큰이 유효하지 않거나 사용자를 찾을 수 없는 경우
    """
    # JWT 토큰 검증
    payload = verify_access_token(credentials.credentials)
    user_id = payload.get("user_id")
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰에서 사용자 ID를 찾을 수 없습니다",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 데이터베이스에서 사용자 조회
    user = crud.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자를 찾을 수 없습니다",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

def get_current_user_optional(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
):
    """
    선택적 JWT 토큰 검증 (토큰이 없어도 허용)
    
    Args:
        db: 데이터베이스 세션
        credentials: HTTP Authorization 헤더의 Bearer 토큰 (선택적)
    
    Returns:
        User | None: 현재 로그인한 사용자 객체 또는 None
    """
    if not credentials:
        return None
    
    try:
        # JWT 토큰 검증
        payload = verify_access_token(credentials.credentials)
        user_id = payload.get("user_id")
        
        if user_id is None:
            return None
        
        # 데이터베이스에서 사용자 조회
        user = crud.get_user(db, user_id=user_id)
        return user
    except:
        return None