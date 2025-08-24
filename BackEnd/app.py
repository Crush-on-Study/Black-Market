from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import initialize_database
from routers import auth, users, listings, trades, chat, achievements

app = FastAPI(
    title="Black Market API",
    version="1.0.0",
    description="API for Black Market, a platform for trading items.",
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React 개발 서버
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 앱 시작시 데이터베이스 초기화 (테이블 생성 및 목업 데이터 로드)
@app.on_event("startup")
def startup_event():
    initialize_database()

# Health Check
@app.get("/", tags=["Default"])
def read_root():
    """API 서버의 상태를 확인합니다."""
    return {"message": "Black Market API is running"}

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(listings.router)
app.include_router(trades.router)
app.include_router(chat.router)
app.include_router(achievements.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)