from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud
import schemas
from database import get_db
from auth_dependencies import get_current_user
from models import User

router = APIRouter(
    prefix="/trades",
    tags=["Trades"],
)

@router.post("/", response_model=schemas.Trade)
def create_trade(
    trade: schemas.TradeCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """새로운 거래를 생성합니다. (인증 필요)"""
    # Verify listing exists and get seller_id
    db_listing = crud.get_listing(db, listing_id=trade.listing_id)
    if not db_listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # 자신의 판매글은 구매할 수 없음
    if db_listing.seller_id == current_user.user_id:
        raise HTTPException(status_code=400, detail="자신의 판매글은 구매할 수 없습니다")
    
    # 현재 로그인한 사용자가 구매자가 됨
    trade_data = schemas.TradeCreate(
        listing_id=trade.listing_id,
        buyer_id=current_user.user_id,
        quantity=trade.quantity,
        total_price=trade.total_price
    )
    
    return crud.create_trade(db=db, trade=trade_data, seller_id=db_listing.seller_id)

@router.get("/", response_model=List[schemas.Trade])
def read_trades(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """모든 거래 목록을 조회합니다. (인증 필요)"""
    trades = crud.get_trades(db, skip=skip, limit=limit)
    return trades

@router.get("/{trade_id}", response_model=schemas.Trade)
def read_trade(
    trade_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """특정 거래의 정보를 조회합니다. (관련 당사자만 조회 가능)"""
    db_trade = crud.get_trade(db, trade_id=trade_id)
    if db_trade is None:
        raise HTTPException(status_code=404, detail="Trade not found")
    
    # 거래 당사자(구매자 또는 판매자)만 조회 가능
    if db_trade.buyer_id != current_user.user_id and db_trade.seller_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="해당 거래의 당사자만 조회할 수 있습니다")
    
    return db_trade

@router.get("/user/{user_id}", response_model=List[schemas.Trade])
def read_user_trades(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """특정 사용자와 관련된 모든 거래 목록을 조회합니다. (본인만 조회 가능)"""
    # 본인의 거래 내역만 조회 가능
    if current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="자신의 거래 내역만 조회할 수 있습니다")
    
    return crud.get_trades_by_user(db, user_id=user_id)