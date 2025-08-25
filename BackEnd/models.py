from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP, Boolean, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    real_name = Column(String(50), nullable=False)  # 실명
    username = Column(String(50), unique=True, nullable=False)  # 닉네임
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    profile_image_url = Column(String(255), nullable=True)
    points_balance = Column(DECIMAL(15, 2), nullable=False, default=0)
    created_at = Column(TIMESTAMP, default=func.current_timestamp())
    last_login_at = Column(TIMESTAMP, nullable=True)
    
    # Relationships
    listings = relationship("Listing", back_populates="seller")
    trades_as_buyer = relationship("Trade", foreign_keys="Trade.buyer_id", back_populates="buyer")
    trades_as_seller = relationship("Trade", foreign_keys="Trade.seller_id", back_populates="seller")
    chat_messages = relationship("ChatMessage", back_populates="sender")
    achievements = relationship("UserAchievement", back_populates="user")

class Listing(Base):
    __tablename__ = "listings"
    
    listing_id = Column(Integer, primary_key=True, autoincrement=True)
    seller_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    item_name = Column(String(100), nullable=False)
    item_description = Column(Text, nullable=True)
    quantity = Column(Integer, nullable=False)
    price_per_unit = Column(DECIMAL(15, 2), nullable=False)
    status = Column(String(20), nullable=False, default='active')
    created_at = Column(TIMESTAMP, default=func.current_timestamp())
    expires_at = Column(TIMESTAMP, nullable=True)
    
    # Relationships
    seller = relationship("User", back_populates="listings")
    trades = relationship("Trade", back_populates="listing")

class Trade(Base):
    __tablename__ = "trades"
    
    trade_id = Column(Integer, primary_key=True, autoincrement=True)
    listing_id = Column(Integer, ForeignKey("listings.listing_id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(DECIMAL(15, 2), nullable=False)
    traded_at = Column(TIMESTAMP, default=func.current_timestamp())
    
    # Relationships
    listing = relationship("Listing", back_populates="trades")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="trades_as_buyer")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="trades_as_seller")

class ChatRoom(Base):
    __tablename__ = "chat_rooms"
    
    room_id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(TIMESTAMP, default=func.current_timestamp())
    
    # Relationships
    messages = relationship("ChatMessage", back_populates="room")
    participants = relationship("ChatParticipant", back_populates="room")

class ChatParticipant(Base):
    __tablename__ = "chat_participants"
    
    room_id = Column(Integer, ForeignKey("chat_rooms.room_id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    
    # Relationships
    room = relationship("ChatRoom", back_populates="participants")
    user = relationship("User")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    message_id = Column(Integer, primary_key=True, autoincrement=True)
    room_id = Column(Integer, ForeignKey("chat_rooms.room_id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    content = Column(Text, nullable=False)
    sent_at = Column(TIMESTAMP, default=func.current_timestamp())
    is_read = Column(Boolean, nullable=False, default=False)
    
    # Relationships
    room = relationship("ChatRoom", back_populates="messages")
    sender = relationship("User", back_populates="chat_messages")

class Achievement(Base):
    __tablename__ = "achievements"
    
    achievement_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon_url = Column(String(255), nullable=True)
    
    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    achievement_id = Column(Integer, ForeignKey("achievements.achievement_id"), primary_key=True)
    earned_at = Column(TIMESTAMP, default=func.current_timestamp())
    
    # Relationships
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")

class EmailVerification(Base):
    __tablename__ = "email_verifications"
    
    verification_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False)
    real_name = Column(String(50), nullable=False)  # 실명
    verification_code = Column(String(6), nullable=False)
    created_at = Column(TIMESTAMP, default=func.current_timestamp())
    expires_at = Column(TIMESTAMP, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    
    token_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    token_hash = Column(String(255), nullable=False, unique=True)
    created_at = Column(TIMESTAMP, default=func.current_timestamp())
    expires_at = Column(TIMESTAMP, nullable=False)
    is_revoked = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    user = relationship("User")