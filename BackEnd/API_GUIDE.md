# Black Market API 가이드

## 설치 및 실행

### Docker를 사용한 실행 (권장)

#### 1. Docker Compose로 전체 스택 실행
```bash
cd BackEnd
docker-compose up -d
```

#### 2. 서비스 접근
- FastAPI 애플리케이션: http://localhost:8000
- API 문서 (Swagger): http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- pgAdmin (DB 관리): http://localhost:5050

### 로컬 개발 환경 실행

#### 1. 의존성 설치
```bash
cd BackEnd
pip install -r requirements.txt
```

#### 2. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 설정 수정
```

#### 3. 서버 실행
```bash
python run.py
```

또는

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

#### 4. API 문서 확인
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 엔드포인트

### Authentication (인증)
- `POST /auth/request-verification` - 이메일 인증 요청 (회원가입 1단계)
- `POST /auth/verify-email` - 이메일 인증 확인 (회원가입 2단계)

### Users (사용자)
- `POST /users/` - 사용자 직접 생성 (개발용)
- `GET /users/` - 사용자 목록 조회
- `GET /users/{user_id}` - 특정 사용자 조회
- `PUT /users/{user_id}` - 사용자 정보 수정
- `DELETE /users/{user_id}` - 사용자 삭제

### Listings (판매 게시물)
- `POST /listings/` - 판매 게시물 생성
- `GET /listings/` - 판매 게시물 목록 조회
- `GET /listings/{listing_id}` - 특정 판매 게시물 조회
- `GET /users/{user_id}/listings` - 특정 사용자의 판매 게시물 조회
- `PUT /listings/{listing_id}` - 판매 게시물 수정
- `DELETE /listings/{listing_id}` - 판매 게시물 삭제

### Trades (거래)
- `POST /trades/` - 거래 생성
- `GET /trades/` - 거래 목록 조회
- `GET /trades/{trade_id}` - 특정 거래 조회
- `GET /users/{user_id}/trades` - 특정 사용자의 거래 내역 조회

### Chat Rooms (채팅방)
- `POST /chat-rooms/` - 채팅방 생성
- `GET /chat-rooms/{room_id}` - 특정 채팅방 조회
- `GET /users/{user_id}/chat-rooms` - 특정 사용자의 채팅방 목록 조회

### Chat Messages (채팅 메시지)
- `POST /chat-messages/` - 채팅 메시지 전송
- `GET /chat-rooms/{room_id}/messages` - 채팅방의 메시지 목록 조회
- `PUT /chat-messages/{message_id}/read` - 메시지 읽음 처리

### Achievements (도전과제)
- `POST /achievements/` - 도전과제 생성
- `GET /achievements/` - 도전과제 목록 조회
- `GET /achievements/{achievement_id}` - 특정 도전과제 조회

### User Achievements (사용자 도전과제)
- `POST /users/{user_id}/achievements/{achievement_id}` - 사용자에게 도전과제 부여
- `GET /users/{user_id}/achievements` - 특정 사용자의 도전과제 목록 조회

## 사용 예시

### 1. 이메일 인증 회원가입

#### 1-1. 이메일 인증 요청
```bash
curl -X POST "http://localhost:8000/auth/request-verification" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "testpassword123"
     }'
```

#### 1-2. 이메일 인증 확인
```bash
curl -X POST "http://localhost:8000/auth/verify-email" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "verification_code": "123456"
     }'
```

### 2. 직접 사용자 생성 (개발용)
```bash
curl -X POST "http://localhost:8000/users/" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "testpassword123"
     }'
```

### 2. 판매 게시물 생성
```bash
curl -X POST "http://localhost:8000/listings/?seller_id=1" \
     -H "Content-Type: application/json" \
     -d '{
       "item_name": "식권 포인트",
       "item_description": "점심 식권 포인트 판매합니다",
       "quantity": 10,
       "price_per_unit": 5000
     }'
```

### 3. 거래 생성
```bash
curl -X POST "http://localhost:8000/trades/" \
     -H "Content-Type: application/json" \
     -d '{
       "listing_id": 1,
       "buyer_id": 2,
       "quantity": 5,
       "total_price": 25000
     }'
```

## 데이터베이스

기본적으로 SQLite를 사용하며, PostgreSQL로 변경하려면 `database.py`에서 DATABASE_URL을 수정하세요.

### SQLite (기본값)
```python
DATABASE_URL = "sqlite:///./blackmarket.db"
```

### PostgreSQL
```python
DATABASE_URL = "postgresql://username:password@localhost/blackmarket"
```

## 보안 고려사항

현재 구현은 기본적인 CRUD 기능만 제공합니다. 프로덕션 환경에서는 다음 사항들을 추가로 구현해야 합니다:

1. JWT 토큰 기반 인증
2. 비밀번호 해싱 (현재 구현됨)
3. 입력 데이터 검증 강화
4. 레이트 리미팅
5. HTTPS 설정
6. 데이터베이스 연결 보안

## 확장 가능한 기능

1. 실시간 채팅 (WebSocket)
2. 파일 업로드 (프로필 이미지, 아이템 이미지)
3. 알림 시스템
4. 검색 및 필터링 기능
5. 페이지네이션 개선
6. 캐싱 (Redis)
7. 로깅 및 모니터링