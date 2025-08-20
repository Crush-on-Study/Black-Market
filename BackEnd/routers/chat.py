from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud
import schemas
from database import get_db

router = APIRouter(
    tags=["Chat"],
)

@router.post("/chat-rooms/", response_model=schemas.ChatRoom)
def create_chat_room(chat_room: schemas.ChatRoomCreate, db: Session = Depends(get_db)):
    """새로운 채팅방을 생성합니다."""
    # Verify all participants exist
    for user_id in chat_room.participant_ids:
        db_user = crud.get_user(db, user_id=user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    
    return crud.create_chat_room(db=db, participant_ids=chat_room.participant_ids)

@router.get("/chat-rooms/{room_id}", response_model=schemas.ChatRoom)
def read_chat_room(room_id: int, db: Session = Depends(get_db)):
    """특정 채팅방의 정보를 조회합니다."""
    db_room = crud.get_chat_room(db, room_id=room_id)
    if db_room is None:
        raise HTTPException(status_code=404, detail="Chat room not found")
    return db_room

@router.get("/users/{user_id}/chat-rooms", response_model=List[schemas.ChatRoom])
def read_user_chat_rooms(user_id: int, db: Session = Depends(get_db)):
    """특정 사용자가 참여하고 있는 모든 채팅방 목록을 조회합니다."""
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.get_chat_rooms_by_user(db, user_id=user_id)

@router.post("/chat-messages/", response_model=schemas.ChatMessage)
def create_chat_message(message: schemas.ChatMessageCreate, sender_id: int, db: Session = Depends(get_db)):
    """채팅방에 새로운 메시지를 전송합니다."""
    # Verify sender exists
    db_user = crud.get_user(db, user_id=sender_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Sender not found")
    
    # Verify chat room exists
    db_room = crud.get_chat_room(db, room_id=message.room_id)
    if not db_room:
        raise HTTPException(status_code=404, detail="Chat room not found")
    
    return crud.create_chat_message(db=db, message=message, sender_id=sender_id)

@router.get("/chat-rooms/{room_id}/messages", response_model=List[schemas.ChatMessage])
def read_chat_messages(room_id: int, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """특정 채팅방의 메시지 목록을 조회합니다."""
    # Verify chat room exists
    db_room = crud.get_chat_room(db, room_id=room_id)
    if not db_room:
        raise HTTPException(status_code=404, detail="Chat room not found")
    
    return crud.get_chat_messages(db, room_id=room_id, skip=skip, limit=limit)

@router.put("/chat-messages/{message_id}/read", response_model=schemas.ChatMessage)
def mark_message_read(message_id: int, db: Session = Depends(get_db)):
    """특정 메시지를 읽음 상태로 변경합니다."""
    db_message = crud.mark_message_as_read(db, message_id=message_id)
    if db_message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    return db_message