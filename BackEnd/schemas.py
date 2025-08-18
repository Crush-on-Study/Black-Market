from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    profile_image_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    profile_image_url: Optional[str] = None
    points_balance: Optional[Decimal] = None

class User(UserBase):
    user_id: int
    points_balance: Decimal
    created_at: datetime
    last_login_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Listing Schemas
class ListingBase(BaseModel):
    item_name: str
    item_description: Optional[str] = None
    quantity: int
    price_per_unit: Decimal

class ListingCreate(ListingBase):
    expires_at: Optional[datetime] = None

class ListingUpdate(BaseModel):
    item_name: Optional[str] = None
    item_description: Optional[str] = None
    quantity: Optional[int] = None
    price_per_unit: Optional[Decimal] = None
    status: Optional[str] = None
    expires_at: Optional[datetime] = None

class Listing(ListingBase):
    listing_id: int
    seller_id: int
    status: str
    created_at: datetime
    expires_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Trade Schemas
class TradeBase(BaseModel):
    quantity: int
    total_price: Decimal

class TradeCreate(TradeBase):
    listing_id: int
    buyer_id: int

class Trade(TradeBase):
    trade_id: int
    listing_id: int
    buyer_id: int
    seller_id: int
    traded_at: datetime
    
    class Config:
        from_attributes = True

# Chat Room Schemas
class ChatRoomBase(BaseModel):
    pass

class ChatRoomCreate(ChatRoomBase):
    participant_ids: List[int]

class ChatRoom(ChatRoomBase):
    room_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Chat Message Schemas
class ChatMessageBase(BaseModel):
    content: str

class ChatMessageCreate(ChatMessageBase):
    room_id: int

class ChatMessage(ChatMessageBase):
    message_id: int
    room_id: int
    sender_id: int
    sent_at: datetime
    is_read: bool
    
    class Config:
        from_attributes = True

# Achievement Schemas
class AchievementBase(BaseModel):
    name: str
    description: str
    icon_url: Optional[str] = None

class AchievementCreate(AchievementBase):
    pass

class Achievement(AchievementBase):
    achievement_id: int
    
    class Config:
        from_attributes = True

# User Achievement Schemas
class UserAchievementBase(BaseModel):
    pass

class UserAchievementCreate(UserAchievementBase):
    user_id: int
    achievement_id: int

class UserAchievement(UserAchievementBase):
    user_id: int
    achievement_id: int
    earned_at: datetime
    
    class Config:
        from_attributes = True

# Email Verification Schemas
class EmailVerificationRequest(BaseModel):
    email: EmailStr

class EmailVerificationConfirm(BaseModel):
    email: EmailStr
    verification_code: str

class EmailVerificationResponse(BaseModel):
    message: str
    email: str

class EmailVerificationSuccess(BaseModel):
    message: str
    email: str
    verification_token: str  # 임시 토큰

# User Setup Schemas (이메일 인증 후 사용자 정보 설정)
class UserSetupRequest(BaseModel):
    email: EmailStr
    verification_token: str
    username: str
    password: str
    profile_image_url: Optional[str] = None

class UserSetupResponse(BaseModel):
    user: User
    access_token: str
    token_type: str = "bearer"