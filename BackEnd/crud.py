from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from models import User, Listing, Trade, ChatRoom, ChatParticipant, ChatMessage, Achievement, UserAchievement, EmailVerification, RefreshToken
import schemas
from passlib.context import CryptContext
from typing import List, Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# User CRUD
def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.user_id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        real_name=user.real_name,
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        profile_image_url=user.profile_image_url
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate) -> Optional[User]:
    db_user = get_user(db, user_id)
    if db_user:
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

def update_last_login(db: Session, user_id: int) -> Optional[User]:
    """사용자의 마지막 로그인 시간을 현재 시간으로 업데이트"""
    db_user = get_user(db, user_id)
    if db_user:
        from datetime import datetime
        db_user.last_login_at = datetime.utcnow()
        db.commit()
        db.refresh(db_user)
    return db_user

# Listing CRUD
def get_listing(db: Session, listing_id: int) -> Optional[Listing]:
    return db.query(Listing).filter(Listing.listing_id == listing_id).first()

def get_listings(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None) -> List[Listing]:
    query = db.query(Listing)
    if status:
        query = query.filter(Listing.status == status)
    return query.offset(skip).limit(limit).all()

def get_listings_by_seller(db: Session, seller_id: int) -> List[Listing]:
    return db.query(Listing).filter(Listing.seller_id == seller_id).all()

def create_listing(db: Session, listing: schemas.ListingCreate, seller_id: int) -> Listing:
    db_listing = Listing(
        seller_id=seller_id,
        item_name=listing.item_name,
        item_description=listing.item_description,
        quantity=listing.quantity,
        price_per_unit=listing.price_per_unit,
        expires_at=listing.expires_at
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

def update_listing(db: Session, listing_id: int, listing_update: schemas.ListingUpdate) -> Optional[Listing]:
    db_listing = get_listing(db, listing_id)
    if db_listing:
        update_data = listing_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_listing, field, value)
        db.commit()
        db.refresh(db_listing)
    return db_listing

def delete_listing(db: Session, listing_id: int) -> bool:
    db_listing = get_listing(db, listing_id)
    if db_listing:
        db.delete(db_listing)
        db.commit()
        return True
    return False

# Trade CRUD
def get_trade(db: Session, trade_id: int) -> Optional[Trade]:
    return db.query(Trade).filter(Trade.trade_id == trade_id).first()

def get_trades(db: Session, skip: int = 0, limit: int = 100) -> List[Trade]:
    return db.query(Trade).offset(skip).limit(limit).all()

def get_trades_by_user(db: Session, user_id: int) -> List[Trade]:
    return db.query(Trade).filter(
        (Trade.buyer_id == user_id) | (Trade.seller_id == user_id)
    ).all()

def create_trade(db: Session, trade: schemas.TradeCreate, seller_id: int) -> Trade:
    db_trade = Trade(
        listing_id=trade.listing_id,
        buyer_id=trade.buyer_id,
        seller_id=seller_id,
        quantity=trade.quantity,
        total_price=trade.total_price
    )
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return db_trade

# Chat Room CRUD
def get_chat_room(db: Session, room_id: int) -> Optional[ChatRoom]:
    return db.query(ChatRoom).filter(ChatRoom.room_id == room_id).first()

def get_chat_rooms_by_user(db: Session, user_id: int) -> List[ChatRoom]:
    return db.query(ChatRoom).join(ChatParticipant).filter(
        ChatParticipant.user_id == user_id
    ).all()

def create_chat_room(db: Session, participant_ids: List[int]) -> ChatRoom:
    db_room = ChatRoom()
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    
    # Add participants
    for user_id in participant_ids:
        participant = ChatParticipant(room_id=db_room.room_id, user_id=user_id)
        db.add(participant)
    
    db.commit()
    return db_room

# Chat Message CRUD
def get_chat_message(db: Session, message_id: int) -> Optional[ChatMessage]:
    return db.query(ChatMessage).filter(ChatMessage.message_id == message_id).first()

def get_chat_messages(db: Session, room_id: int, skip: int = 0, limit: int = 50) -> List[ChatMessage]:
    return db.query(ChatMessage).filter(
        ChatMessage.room_id == room_id
    ).order_by(ChatMessage.sent_at.desc()).offset(skip).limit(limit).all()

def create_chat_message(db: Session, message: schemas.ChatMessageCreate, sender_id: int) -> ChatMessage:
    db_message = ChatMessage(
        room_id=message.room_id,
        sender_id=sender_id,
        content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def mark_message_as_read(db: Session, message_id: int) -> Optional[ChatMessage]:
    db_message = db.query(ChatMessage).filter(ChatMessage.message_id == message_id).first()
    if db_message:
        db_message.is_read = True
        db.commit()
        db.refresh(db_message)
    return db_message

# Achievement CRUD
def get_achievement(db: Session, achievement_id: int) -> Optional[Achievement]:
    return db.query(Achievement).filter(Achievement.achievement_id == achievement_id).first()

def get_achievements(db: Session) -> List[Achievement]:
    return db.query(Achievement).all()

def create_achievement(db: Session, achievement: schemas.AchievementCreate) -> Achievement:
    db_achievement = Achievement(
        name=achievement.name,
        description=achievement.description,
        icon_url=achievement.icon_url
    )
    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)
    return db_achievement

# User Achievement CRUD
def get_user_achievements(db: Session, user_id: int) -> List[UserAchievement]:
    return db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()

def create_user_achievement(db: Session, user_id: int, achievement_id: int) -> UserAchievement:
    # Check if already exists
    existing = db.query(UserAchievement).filter(
        and_(UserAchievement.user_id == user_id, UserAchievement.achievement_id == achievement_id)
    ).first()
    
    if existing:
        return existing
    
    db_user_achievement = UserAchievement(
        user_id=user_id,
        achievement_id=achievement_id
    )
    db.add(db_user_achievement)
    db.commit()
    db.refresh(db_user_achievement)
    return db_user_achievement

# Email Verification CRUD
def create_email_verification(db: Session, email: str, verification_code: str, real_name: str, expires_at) -> EmailVerification:
    # 기존 미인증 요청 삭제
    db.query(EmailVerification).filter(
        and_(EmailVerification.email == email, EmailVerification.is_verified == False)
    ).delete()
    
    db_verification = EmailVerification(
        email=email,
        real_name=real_name,
        verification_code=verification_code,
        expires_at=expires_at
    )
    db.add(db_verification)
    db.commit()
    db.refresh(db_verification)
    return db_verification

# 이 함수는 더 이상 사용되지 않습니다. username은 request-verification에서 받고, 
# setup-user에서는 인증된 이메일에서 username을 가져옵니다.
# def update_email_verification_with_user_data(db: Session, verification_id: int, username: str, 
#                                            password: str, profile_image_url: Optional[str] = None) -> Optional[EmailVerification]:
#     db_verification = db.query(EmailVerification).filter(
#         EmailVerification.verification_id == verification_id
#     ).first()
#     
#     if db_verification:
#         db_verification.username = username
#         db_verification.password_hash = get_password_hash(password)
#         db_verification.profile_image_url = profile_image_url
#         db.commit()
#         db.refresh(db_verification)
#     
#     return db_verification

def get_email_verification(db: Session, email: str, verification_code: str) -> Optional[EmailVerification]:
    return db.query(EmailVerification).filter(
        and_(
            EmailVerification.email == email,
            EmailVerification.verification_code == verification_code,
            EmailVerification.expires_at > func.now()
        )
    ).first()

def verify_email_verification(db: Session, verification_id: int) -> Optional[EmailVerification]:
    db_verification = db.query(EmailVerification).filter(
        EmailVerification.verification_id == verification_id
    ).first()
    
    if db_verification:
        db_verification.is_verified = True
        db.commit()
        db.refresh(db_verification)
    
    return db_verification

def cleanup_expired_verifications(db: Session):
    """만료된 인증 요청 정리"""
    db.query(EmailVerification).filter(
        EmailVerification.expires_at < func.now()
    ).delete()
    db.commit()

# Refresh Token CRUD
def create_refresh_token(db: Session, user_id: int, token_hash: str, expires_at) -> RefreshToken:
    """새로운 리프레시 토큰 생성"""
    db_refresh_token = RefreshToken(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at
    )
    db.add(db_refresh_token)
    db.commit()
    db.refresh(db_refresh_token)
    return db_refresh_token

def get_refresh_token(db: Session, token_hash: str) -> Optional[RefreshToken]:
    """리프레시 토큰 조회"""
    return db.query(RefreshToken).filter(
        and_(
            RefreshToken.token_hash == token_hash,
            RefreshToken.is_revoked == False,
            RefreshToken.expires_at > func.now()
        )
    ).first()

def revoke_refresh_token(db: Session, token_hash: str) -> bool:
    """리프레시 토큰 무효화"""
    db_token = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()
    if db_token:
        db_token.is_revoked = True
        db.commit()
        return True
    return False

def revoke_all_user_refresh_tokens(db: Session, user_id: int) -> int:
    """사용자의 모든 리프레시 토큰 무효화"""
    count = db.query(RefreshToken).filter(
        and_(RefreshToken.user_id == user_id, RefreshToken.is_revoked == False)
    ).update({"is_revoked": True})
    db.commit()
    return count

def cleanup_expired_refresh_tokens(db: Session):
    """만료된 리프레시 토큰 정리"""
    db.query(RefreshToken).filter(
        RefreshToken.expires_at < func.now()
    ).delete()
    db.commit()