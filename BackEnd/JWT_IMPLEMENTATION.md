# JWT 인증 시스템 구현 가이드

## 개요

이 문서는 Black-Market 백엔드의 JWT(JSON Web Token) 인증 시스템 구현에 대한 상세한 설명을 제공합니다.

## 구현된 기능

### 1. 토큰 타입

#### 액세스 토큰 (Access Token)
- **용도**: API 요청 인증
- **만료 시간**: 20분 (기본값)
- **포함 정보**: user_id, email, 토큰 타입, 만료 시간
- **보안**: 짧은 만료 시간으로 보안 강화

#### 리프레시 토큰 (Refresh Token)
- **용도**: 액세스 토큰 갱신
- **만료 시간**: 14일
- **포함 정보**: 랜덤 문자열 (해시화하여 DB 저장)
- **보안**: 해시화하여 DB에 저장, 무효화 가능

#### 인증 토큰 (Verification Token)
- **용도**: 이메일 인증 완료 후 사용자 설정
- **만료 시간**: 30분
- **포함 정보**: verification_id, email, 토큰 타입

### 2. API 엔드포인트

#### 인증 관련
- `POST /auth/request-verification` - 이메일 인증 요청
- `POST /auth/verify-email` - 이메일 인증 코드 확인
- `POST /auth/setup-user` - 사용자 정보 설정 및 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 액세스 토큰 갱신
- `POST /auth/logout` - 로그아웃
- `POST /auth/logout-all` - 모든 디바이스 로그아웃

### 3. 보안 기능

#### 토큰 무효화
- 로그아웃 시 리프레시 토큰 무효화
- 모든 디바이스 로그아웃 기능
- 만료된 토큰 자동 정리

#### 토큰 검증
- JWT 서명 검증
- 토큰 타입 검증
- 만료 시간 검증
- 사용자 존재 여부 검증

## 사용 방법

### 1. 회원가입 플로우

```python
# 1. 이메일 인증 요청
POST /auth/request-verification
{
    "email": "user@example.com"
}

# 2. 이메일 인증 코드 확인
POST /auth/verify-email
{
    "email": "user@example.com",
    "verification_code": "123456"
}

# 3. 사용자 정보 설정
POST /auth/setup-user
{
    "email": "user@example.com",
    "verification_token": "jwt_token_here",
    "username": "username",
    "password": "password",
    "profile_image_url": "optional_url"
}
```

### 2. 로그인 플로우

```python
# 로그인
POST /auth/login
{
    "email": "user@example.com",
    "password": "password"
}

# 응답
{
    "user": {...},
    "access_token": "jwt_access_token",
    "refresh_token": "random_refresh_token",
    "token_type": "bearer",
    "message": "로그인 성공"
}
```

### 3. 토큰 갱신

```python
# 액세스 토큰 갱신
POST /auth/refresh
{
    "refresh_token": "refresh_token_here"
}

# 응답
{
    "access_token": "new_jwt_access_token",
    "refresh_token": "new_random_refresh_token",
    "token_type": "bearer"
}
```

### 4. API 요청 시 인증

```python
# 헤더에 액세스 토큰 포함
Authorization: Bearer <access_token>

# 의존성 주입으로 사용자 정보 가져오기
from auth_dependencies import get_current_user

@router.get("/protected")
def protected_route(current_user = Depends(get_current_user)):
    return {"message": f"Hello {current_user.username}"}
```

## 의존성 주입

### 1. 필수 인증
```python
from auth_dependencies import get_current_user

@router.get("/profile")
def get_profile(current_user = Depends(get_current_user)):
    return current_user
```

### 2. 선택적 인증
```python
from auth_dependencies import get_current_user_optional

@router.get("/public-data")
def get_public_data(current_user = Depends(get_current_user_optional)):
    if current_user:
        return {"data": "personalized_data", "user": current_user.username}
    return {"data": "public_data"}
```

## 환경 변수

```bash
# JWT 설정
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256

# 토큰 만료 시간 (분)
ACCESS_TOKEN_EXPIRE_MINUTES=20
VERIFICATION_TOKEN_EXPIRE_MINUTES=30

# 리프레시 토큰 만료 시간 (일)
REFRESH_TOKEN_EXPIRE_DAYS=14
```

## 데이터베이스 스키마

### RefreshToken 테이블
```sql
CREATE TABLE refresh_tokens (
    token_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

## 보안 고려사항

### 1. 토큰 보안
- 액세스 토큰은 짧은 만료 시간 (20분)
- 리프레시 토큰은 해시화하여 DB 저장
- 토큰 무효화 기능으로 보안 강화

### 2. HTTPS 사용
- 프로덕션 환경에서는 반드시 HTTPS 사용
- 토큰 전송 시 암호화 보장

### 3. 토큰 저장
- 클라이언트에서는 안전한 저장소 사용
- localStorage 대신 httpOnly 쿠키 또는 안전한 저장소 권장

## 테스트

JWT 기능을 테스트하려면:

```bash
cd BackEnd
python test_jwt.py
```

## 문제 해결

### 1. 토큰 만료
- 액세스 토큰 만료 시 `/auth/refresh` 엔드포인트 사용
- 리프레시 토큰 만료 시 재로그인 필요

### 2. 인증 실패
- 토큰 형식 확인 (Bearer 접두사 포함)
- 토큰 만료 시간 확인
- 사용자 계정 상태 확인

### 3. 리프레시 토큰 문제
- 리프레시 토큰 무효화 여부 확인
- 만료된 리프레시 토큰 정리

## 향후 개선 사항

1. **토큰 블랙리스트**: 로그아웃된 토큰의 즉시 무효화
2. **다중 디바이스 관리**: 디바이스별 토큰 관리
3. **토큰 사용 통계**: 보안 모니터링을 위한 토큰 사용 패턴 분석
4. **Rate Limiting**: 토큰 갱신 요청 제한
5. **2FA 지원**: 2단계 인증 추가 