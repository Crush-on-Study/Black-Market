from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from auth_utils import get_current_user_from_token
import crud

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    JWT 토큰에서 현재 사용자 정보를 추출하는 의존성 함수
    """
    token = credentials.credentials
    payload = get_current_user_from_token(token)
    
    # DB에서 사용자 정보 확인
    user = crud.get_user(db, user_id=payload.get("user_id"))
    if not user:
        raise HTTPException(
            status_code=401,
            detail="사용자를 찾을 수 없습니다",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

def get_current_active_user(current_user = Depends(get_current_user)):
    """
    현재 활성 사용자를 반환하는 의존성 함수
    """
    # 여기에 추가적인 사용자 상태 검증 로직을 추가할 수 있습니다
    # 예: 계정 정지, 이메일 미인증 등
    return current_user

def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    선택적 사용자 인증 의존성 함수 (로그인하지 않은 사용자도 허용)
    """
    try:
        token = credentials.credentials
        payload = get_current_user_from_token(token)
        
        # DB에서 사용자 정보 확인
        user = crud.get_user(db, user_id=payload.get("user_id"))
        if not user:
            return None
        
        return user
    except HTTPException:
        return None