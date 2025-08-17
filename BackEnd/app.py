from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import crud
import schemas
from database import get_db, create_tables
from models import User

app = FastAPI(title="Black Market API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React 개발 서버
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 앱 시작시 테이블 생성
@app.on_event("startup")
def startup_event():
    create_tables()

# Health Check
@app.get("/")
def read_root():
    return {"message": "Black Market API is running"}

# Email Verification endpoints
@app.post("/auth/request-verification", response_model=schemas.EmailVerificationResponse)
def request_email_verification(request: schemas.EmailVerificationRequest, db: Session = Depends(get_db)):
    """이메일 인증 요청"""
    # 이메일과 사용자명이 모두 중복되는 경우에만 에러 발생
    existing_user = crud.get_user_by_email(db, email=request.email)
    existing_username = crud.get_user_by_username(db, username=request.username)
    if existing_user and existing_username:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일과 사용자명입니다")
    
    # 비밀번호 해싱
    password_hash = crud.get_password_hash(request.password)
    
    # 인증 코드 생성
    from email_service import email_service
    verification_code = email_service.generate_verification_code()
    expires_at = email_service.get_expiry_time(10)  # 10분 후 만료
    
    # 이메일 인증 요청 저장
    crud.create_email_verification(
        db=db,
        email=request.email,
        username=request.username,
        password_hash=password_hash,
        profile_image_url=request.profile_image_url,
        verification_code=verification_code,
        expires_at=expires_at
    )
    
    # 이메일 전송
    email_sent = email_service.send_verification_email(
        to_email=request.email,
        username=request.username,
        verification_code=verification_code
    )
    
    if not email_sent:
        raise HTTPException(status_code=500, detail="이메일 전송에 실패했습니다")
    
    return schemas.EmailVerificationResponse(
        message="인증 코드가 이메일로 전송되었습니다. 10분 내에 인증을 완료해주세요.",
        email=request.email
    )

@app.post("/auth/verify-email", response_model=schemas.User)
def verify_email(request: schemas.EmailVerificationConfirm, db: Session = Depends(get_db)):
    """이메일 인증 확인 및 회원가입 완료"""
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
    
    # 사용자 생성
    user_data = schemas.UserCreate(
        username=verification.username,
        email=verification.email,
        password=verification.password_hash,  # 이미 해싱된 비밀번호
        profile_image_url=verification.profile_image_url
    )
    
    # 직접 사용자 생성 (비밀번호는 이미 해싱됨)
    db_user = User(
        username=verification.username,
        email=verification.email,
        password_hash=verification.password_hash,
        profile_image_url=verification.profile_image_url
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # 만료된 인증 요청 정리
    crud.cleanup_expired_verifications(db)
    
    return db_user

# User endpoints
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """직접 회원가입 (이메일 인증 없이) - 개발용"""
    # Check if user already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = crud.update_user(db, user_id=user_id, user_update=user_update)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_user(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# Listing endpoints
@app.post("/listings/", response_model=schemas.Listing)
def create_listing(listing: schemas.ListingCreate, seller_id: int, db: Session = Depends(get_db)):
    # Verify seller exists
    db_user = crud.get_user(db, user_id=seller_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Seller not found")
    
    return crud.create_listing(db=db, listing=listing, seller_id=seller_id)

@app.get("/listings/", response_model=List[schemas.Listing])
def read_listings(skip: int = 0, limit: int = 100, status: str = None, db: Session = Depends(get_db)):
    listings = crud.get_listings(db, skip=skip, limit=limit, status=status)
    return listings

@app.get("/listings/{listing_id}", response_model=schemas.Listing)
def read_listing(listing_id: int, db: Session = Depends(get_db)):
    db_listing = crud.get_listing(db, listing_id=listing_id)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return db_listing

@app.get("/users/{user_id}/listings", response_model=List[schemas.Listing])
def read_user_listings(user_id: int, db: Session = Depends(get_db)):
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.get_listings_by_seller(db, seller_id=user_id)

@app.put("/listings/{listing_id}", response_model=schemas.Listing)
def update_listing(listing_id: int, listing_update: schemas.ListingUpdate, db: Session = Depends(get_db)):
    db_listing = crud.update_listing(db, listing_id=listing_id, listing_update=listing_update)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return db_listing

@app.delete("/listings/{listing_id}")
def delete_listing(listing_id: int, db: Session = Depends(get_db)):
    success = crud.delete_listing(db, listing_id=listing_id)
    if not success:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"message": "Listing deleted successfully"}

# Trade endpoints
@app.post("/trades/", response_model=schemas.Trade)
def create_trade(trade: schemas.TradeCreate, db: Session = Depends(get_db)):
    # Verify listing exists and get seller_id
    db_listing = crud.get_listing(db, listing_id=trade.listing_id)
    if not db_listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Verify buyer exists
    db_buyer = crud.get_user(db, user_id=trade.buyer_id)
    if not db_buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    
    return crud.create_trade(db=db, trade=trade, seller_id=db_listing.seller_id)

@app.get("/trades/", response_model=List[schemas.Trade])
def read_trades(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    trades = crud.get_trades(db, skip=skip, limit=limit)
    return trades

@app.get("/trades/{trade_id}", response_model=schemas.Trade)
def read_trade(trade_id: int, db: Session = Depends(get_db)):
    db_trade = crud.get_trade(db, trade_id=trade_id)
    if db_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
    return db_trade

@app.get("/users/{user_id}/trades", response_model=List[schemas.Trade])
def read_user_trades(user_id: int, db: Session = Depends(get_db)):
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.get_trades_by_user(db, user_id=user_id)

# Chat Room endpoints
@app.post("/chat-rooms/", response_model=schemas.ChatRoom)
def create_chat_room(chat_room: schemas.ChatRoomCreate, db: Session = Depends(get_db)):
    # Verify all participants exist
    for user_id in chat_room.participant_ids:
        db_user = crud.get_user(db, user_id=user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    
    return crud.create_chat_room(db=db, participant_ids=chat_room.participant_ids)

@app.get("/chat-rooms/{room_id}", response_model=schemas.ChatRoom)
def read_chat_room(room_id: int, db: Session = Depends(get_db)):
    db_room = crud.get_chat_room(db, room_id=room_id)
    if db_room is None:
        raise HTTPException(status_code=404, detail="Chat room not found")
    return db_room

@app.get("/users/{user_id}/chat-rooms", response_model=List[schemas.ChatRoom])
def read_user_chat_rooms(user_id: int, db: Session = Depends(get_db)):
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.get_chat_rooms_by_user(db, user_id=user_id)

# Chat Message endpoints
@app.post("/chat-messages/", response_model=schemas.ChatMessage)
def create_chat_message(message: schemas.ChatMessageCreate, sender_id: int, db: Session = Depends(get_db)):
    # Verify sender exists
    db_user = crud.get_user(db, user_id=sender_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Sender not found")
    
    # Verify chat room exists
    db_room = crud.get_chat_room(db, room_id=message.room_id)
    if not db_room:
        raise HTTPException(status_code=404, detail="Chat room not found")
    
    return crud.create_chat_message(db=db, message=message, sender_id=sender_id)

@app.get("/chat-rooms/{room_id}/messages", response_model=List[schemas.ChatMessage])
def read_chat_messages(room_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    # Verify chat room exists
    db_room = crud.get_chat_room(db, room_id=room_id)
    if not db_room:
        raise HTTPException(status_code=404, detail="Chat room not found")
    
    return crud.get_chat_messages(db, room_id=room_id, skip=skip, limit=limit)

@app.put("/chat-messages/{message_id}/read", response_model=schemas.ChatMessage)
def mark_message_read(message_id: int, db: Session = Depends(get_db)):
    db_message = crud.mark_message_as_read(db, message_id=message_id)
    if db_message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    return db_message

# Achievement endpoints
@app.post("/achievements/", response_model=schemas.Achievement)
def create_achievement(achievement: schemas.AchievementCreate, db: Session = Depends(get_db)):
    return crud.create_achievement(db=db, achievement=achievement)

@app.get("/achievements/", response_model=List[schemas.Achievement])
def read_achievements(db: Session = Depends(get_db)):
    return crud.get_achievements(db)

@app.get("/achievements/{achievement_id}", response_model=schemas.Achievement)
def read_achievement(achievement_id: int, db: Session = Depends(get_db)):
    db_achievement = crud.get_achievement(db, achievement_id=achievement_id)
    if db_achievement is None:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return db_achievement

# User Achievement endpoints
@app.post("/users/{user_id}/achievements/{achievement_id}", response_model=schemas.UserAchievement)
def award_user_achievement(user_id: int, achievement_id: int, db: Session = Depends(get_db)):
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify achievement exists
    db_achievement = crud.get_achievement(db, achievement_id=achievement_id)
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    return crud.create_user_achievement(db=db, user_id=user_id, achievement_id=achievement_id)

@app.get("/users/{user_id}/achievements", response_model=List[schemas.UserAchievement])
def read_user_achievements(user_id: int, db: Session = Depends(get_db)):
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.get_user_achievements(db, user_id=user_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)