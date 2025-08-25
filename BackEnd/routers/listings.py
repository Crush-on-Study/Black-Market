from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import crud
import schemas
from database import get_db
from auth_dependencies import get_current_user, get_current_user_optional
from models import User

router = APIRouter(
    prefix="/listings",
    tags=["Listings"],
)

@router.post("/", response_model=schemas.Listing)
def create_listing(
    listing: schemas.ListingCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """새로운 판매글을 생성합니다. (인증 필요)"""
    # 현재 로그인한 사용자가 판매자가 됨
    return crud.create_listing(db=db, listing=listing, seller_id=current_user.user_id)

@router.get("/", response_model=List[schemas.Listing])
def read_listings(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    """모든 판매글 목록을 조회합니다. (상태별 필터링 가능, 인증 불필요)"""
    listings = crud.get_listings(db, skip=skip, limit=limit, status=status)
    return listings

@router.get("/{listing_id}", response_model=schemas.Listing)
def read_listing(listing_id: int, db: Session = Depends(get_db)):
    """특정 판매글의 정보를 조회합니다. (인증 불필요)"""
    db_listing = crud.get_listing(db, listing_id=listing_id)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return db_listing

@router.get("/user/{user_id}", response_model=List[schemas.Listing])
def read_user_listings(user_id: int, db: Session = Depends(get_db)):
    """특정 사용자가 작성한 모든 판매글 목록을 조회합니다. (인증 불필요)"""
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.get_listings_by_seller(db, seller_id=user_id)

@router.put("/{listing_id}", response_model=schemas.Listing)
def update_listing(
    listing_id: int, 
    listing_update: schemas.ListingUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """특정 판매글의 정보를 수정합니다. (작성자만 수정 가능)"""
    # 기존 판매글 조회
    db_listing = crud.get_listing(db, listing_id=listing_id)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # 작성자만 수정할 수 있도록 권한 확인
    if db_listing.seller_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="자신이 작성한 판매글만 수정할 수 있습니다")
    
    db_listing = crud.update_listing(db, listing_id=listing_id, listing_update=listing_update)
    return db_listing

@router.delete("/{listing_id}")
def delete_listing(
    listing_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """특정 판매글을 삭제합니다. (작성자만 삭제 가능)"""
    # 기존 판매글 조회
    db_listing = crud.get_listing(db, listing_id=listing_id)
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # 작성자만 삭제할 수 있도록 권한 확인
    if db_listing.seller_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="자신이 작성한 판매글만 삭제할 수 있습니다")
    
    success = crud.delete_listing(db, listing_id=listing_id)
    if not success:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"message": "Listing deleted successfully"}