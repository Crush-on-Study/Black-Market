from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
import crud
import schemas
from database import get_db
from models import User, EmailVerification
from auth_utils import (
    create_verification_token, 
    verify_verification_token, 
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
    REFRESH_TOKEN_EXPIRE_DAYS
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.post("/request-verification", response_model=schemas.EmailVerificationResponse)
def request_email_verification(request: schemas.EmailVerificationRequest, db: Session = Depends(get_db)):
    """
    이메일 인증을 요청합니다.
    - 이메일 중복을 확인합니다.
    - 인증 코드를 생성하여 DB에 저장합니다.
    - 사용자에게 인증 코드가 포함된 이메일을 전송합니다.
    """
    # 이메일 중복 확인
    existing_user = crud.get_user_by_email(db, email=request.email)
    
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다")
    
    # 인증 코드 생성
    from email_service import email_service
    verification_code = email_service.generate_verification_code()
    expires_at = email_service.get_expiry_time(10)  # 10분 후 만료
    
    # 이메일 인증 요청 저장 (이메일만)
    crud.create_email_verification(
        db=db,
        email=request.email,
        verification_code=verification_code,
        expires_at=expires_at
    )
    
    # 이메일 전송
    email_sent = email_service.send_verification_email(
        to_email=request.email,
        verification_code=verification_code
    )
    
    if not email_sent:
        raise HTTPException(status_code=500, detail="이메일 전송에 실패했습니다")
    
    return schemas.EmailVerificationResponse(
        message="인증 코드가 이메일로 전송되었습니다. 10분 내에 인증을 완료해주세요.",
        email=request.email
    )

@router.post("/verify-email", response_model=schemas.EmailVerificationSuccess)
def verify_email(request: schemas.EmailVerificationConfirm, db: Session = Depends(get_db)):
    """
    이메일 인증 코드를 확인합니다.
    - DB에서 유효한 인증 코드가 있는지 확인합니다.
    - 인증 완료 상태로 변경하고, 다음 단계에서 사용할 인증 토큰을 발급합니다.
    """
    # 인증 코드 확인
    verification = crud.get_email_verification(
        db=db,
        email=request.email,
        verification_code=request.verification_code
    )
    
    if not verification:
        raise HTTPException(
            status_code=400, 
            detail="잘못된 인증 코드이거나 만료된 요청입니다"
        )
    
    # 인증 완료 처리
    crud.verify_email_verification(db=db, verification_id=verification.verification_id)
    
    # JWT 토큰 생성
    verification_token = create_verification_token(
        verification_id=verification.verification_id,
        email=request.email
    )
    
    return schemas.EmailVerificationSuccess(
        message="이메일 인증이 완료되었습니다. 닉네임과 비밀번호를 설정해주세요.",
        email=request.email,
        verification_token=verification_token
    )

@router.post("/setup-user", response_model=schemas.UserSetupResponse)
def setup_user(request: schemas.UserSetupRequest, db: Session = Depends(get_db)):
    """
    이메일 인증 완료 후 사용자 정보를 설정하여 회원가입을 완료합니다.
    - 인증 토큰을 검증합니다.
    - 닉네임 중복을 확인합니다.
    - 사용자 정보를 DB에 저장하고, 로그인에 사용할 액세스 토큰을 발급합니다.
    """
    # JWT 토큰 검증
    payload = verify_verification_token(request.verification_token)
    verification_id = payload.get("verification_id")
    token_email = payload.get("email")
    
    # 토큰의 이메일과 요청의 이메일이 일치하는지 확인
    if token_email != request.email:
        raise HTTPException(status_code=400, detail="토큰과 이메일이 일치하지 않습니다")
    
    # 인증 정보 확인
    verification = db.query(EmailVerification).filter(
        and_(
            EmailVerification.verification_id == verification_id,
            EmailVerification.email == request.email,
            EmailVerification.is_verified == True
        )
    ).first()

    if not verification:
        raise HTTPException(status_code=400, detail="유효하지 않은 인증 정보입니다")
    
    # 이미 사용자가 생성되었는지 확인
    existing_user = crud.get_user_by_email(db, email=request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 회원가입이 완료된 이메일입니다")
    
    # 닉네임 중복 확인
    existing_username = crud.get_user_by_username(db, username=request.username)
    if existing_username:
        raise HTTPException(status_code=400, detail="이미 사용 중인 닉네임입니다")
    
    


    # 사용자 생성
    db_user = User(
        username=request.username,  # 요청에서 받은 사용자명 사용
        email=request.email,
        password_hash=crud.get_password_hash(request.password),
        profile_image_url=request.profile_image_url
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # 액세스 토큰 생성
    access_token = create_access_token(
        user_id=db_user.user_id,
        email=db_user.email
    )
    
    # 사용된 인증 정보 삭제
    db.delete(verification)
    db.commit()
    
    # 만료된 인증 요청 정리
    crud.cleanup_expired_verifications(db)
    
    return schemas.UserSetupResponse(
        user=db_user,
        access_token=access_token,
        token_type="bearer"
    )

@router.post("/login", response_model=schemas.LoginResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    """
    이메일과 비밀번호로 로그인합니다.
    - 이메일로 사용자를 찾습니다.
    - 비밀번호를 검증합니다.
    - 로그인 성공 시 액세스 토큰을 발급합니다.
    - 마지막 로그인 시간을 업데이트합니다.
    """
    # 이메일로 사용자 찾기
    user = crud.get_user_by_email(db, email=request.email)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="이메일 또는 비밀번호가 올바르지 않습니다"
        )
    
    # 비밀번호 검증
    if not crud.verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="이메일 또는 비밀번호가 올바르지 않습니다"
        )
    
    # 마지막 로그인 시간 업데이트
    crud.update_last_login(db, user_id=user.user_id)
    
    # 액세스 토큰 생성
    access_token = create_access_token(
        user_id=user.user_id,
        email=user.email
    )
    
    return schemas.LoginResponse(
        user=user,
        access_token=access_token,
        token_type="bearer",
        message="로그인 성공"
    )