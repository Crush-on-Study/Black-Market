from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud
import schemas
from database import get_db
from auth_dependencies import get_current_user
from models import User

router = APIRouter(
    tags=["Achievements"],
)

@router.post("/achievements/", response_model=schemas.Achievement)
def create_achievement(
    achievement: schemas.AchievementCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """(관리자용) 새로운 도전과제를 생성합니다. (관리자 권한 필요)"""
    # 관리자 권한 확인 (예: is_admin 필드가 있다고 가정)
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="관리자 권한이 필요합니다")
    
    return crud.create_achievement(db=db, achievement=achievement)

@router.get("/achievements/", response_model=List[schemas.Achievement])
def read_achievements(db: Session = Depends(get_db)):
    """모든 도전과제 목록을 조회합니다."""
    return crud.get_achievements(db)

@router.get("/achievements/{achievement_id}", response_model=schemas.Achievement)
def read_achievement(achievement_id: int, db: Session = Depends(get_db)):
    """특정 도전과제의 정보를 조회합니다."""
    db_achievement = crud.get_achievement(db, achievement_id=achievement_id)
    if db_achievement is None:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return db_achievement

@router.post("/users/{user_id}/achievements/{achievement_id}", response_model=schemas.UserAchievement)
def award_user_achievement(
    user_id: int, 
    achievement_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """특정 사용자에게 도전과제를 부여합니다. (관리자 권한 필요)"""
    # 관리자 권한 확인
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="관리자 권한이 필요합니다")
    
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify achievement exists
    db_achievement = crud.get_achievement(db, achievement_id=achievement_id)
    if not db_achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    return crud.create_user_achievement(db=db, user_id=user_id, achievement_id=achievement_id)

@router.get("/users/{user_id}/achievements", response_model=List[schemas.UserAchievement])
def read_user_achievements(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """특정 사용자가 달성한 모든 도전과제 목록을 조회합니다. (본인 또는 관리자만 조회 가능)"""
    # 본인 또는 관리자만 조회할 수 있도록 권한 확인
    if user_id != current_user.user_id and not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="본인의 도전과제만 조회할 수 있습니다")
    
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.get_user_achievements(db, user_id=user_id)