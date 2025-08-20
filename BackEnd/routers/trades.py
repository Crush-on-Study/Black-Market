from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud
import schemas
from database import get_db

router = APIRouter(
    prefix="/trades",
    tags=["Trades"],
)

@router.post("/", response_model=schemas.Trade)
def create_trade(trade: schemas.TradeCreate, db: Session = Depends(get_db)):
    """새로운 거래를 생성합니다."""
    # Verify listing exists and get seller_id
    db_listing = crud.get_listing(db, listing_id=trade.listing_id)
    if not db_listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Verify buyer exists
    db_buyer = crud.get_user(db, user_id=trade.buyer_id)
    if not db_buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    
    return crud.create_trade(db=db, trade=trade, seller_id=db_listing.seller_id)

@router.get("/", response_model=List[schemas.Trade])
def read_trades(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """모든 거래 목록을 조회합니다."""
    trades = crud.get_trades(db, skip=skip, limit=limit)
    return trades

@router.get("/{trade_id}", response_model=schemas.Trade)
def read_trade(trade_id: int, db: Session = Depends(get_db)):
    """특정 거래의 정보를 조회합니다."""
    db_trade = crud.get_trade(db, trade_id=trade_id)
    if db_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
    return db_trade

@router.get("/user/{user_id}", response_model=List[schemas.Trade])
def read_user_trades(user_id: int, db: Session = Depends(get_db)):
    """특정 사용자와 관련된 모든 거래 목록을 조회합니다 (판매자 또는 구매자)."""
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.get_trades_by_user(db, user_id=user_id)