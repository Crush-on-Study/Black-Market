# 이메일 인증 설정 가이드

## 📧 Gmail SMTP 설정

### 1. Gmail 앱 비밀번호 생성

1. **Google 계정 설정**으로 이동: https://myaccount.google.com/
2. **보안** 탭 클릭
3. **2단계 인증**이 활성화되어 있는지 확인 (필수)
4. **앱 비밀번호** 검색 후 클릭
5. **앱 선택**: 메일
6. **기기 선택**: 기타 (사용자 지정 이름)
7. 이름 입력: "Black Market API"
8. **생성** 클릭
9. 생성된 16자리 비밀번호 복사

### 2. 환경 변수 설정

`.env` 파일에서 다음 값들을 수정하세요:

```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-gmail@gmail.com
SMTP_PASSWORD=your-16-digit-app-password
FROM_EMAIL=your-gmail@gmail.com
```

### 3. 다른 이메일 서비스 설정

#### Naver 메일
```env
SMTP_SERVER=smtp.naver.com
SMTP_PORT=587
SMTP_USERNAME=your-naver-id@naver.com
SMTP_PASSWORD=your-naver-password
FROM_EMAIL=your-naver-id@naver.com
```

#### Daum 메일
```env
SMTP_SERVER=smtp.daum.net
SMTP_PORT=587
SMTP_USERNAME=your-daum-id@daum.net
SMTP_PASSWORD=your-daum-password
FROM_EMAIL=your-daum-id@daum.net
```

#### Outlook/Hotmail
```env
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=your-email@outlook.com
SMTP_PASSWORD=your-outlook-password
FROM_EMAIL=your-email@outlook.com
```

## 🔧 개발 환경 설정

### 개발 모드 (이메일 전송 없이)

이메일 설정을 하지 않으면 콘솔에 인증 코드가 출력됩니다:

```env
# 이메일 설정을 비워두거나 주석 처리
# SMTP_USERNAME=
# SMTP_PASSWORD=
```

콘솔 출력 예시:
```
=== 이메일 인증 코드 (개발 모드) ===
받는 사람: test@example.com
사용자명: testuser
인증 코드: 123456
================================
```

## 🚀 Docker 환경에서 이메일 설정

### docker-compose.yml 환경 변수 추가

```yaml
api:
  build: .
  environment:
    - DATABASE_URL=postgresql://blackmarket_user:blackmarket_password@db:5432/blackmarket
    - SMTP_SERVER=smtp.gmail.com
    - SMTP_PORT=587
    - SMTP_USERNAME=your-gmail@gmail.com
    - SMTP_PASSWORD=your-app-password
    - FROM_EMAIL=your-gmail@gmail.com
```

또는 `.env` 파일 사용:

```yaml
api:
  build: .
  env_file:
    - .env
```

## 🔍 트러블슈팅

### 1. Gmail 인증 오류
- 2단계 인증이 활성화되어 있는지 확인
- 앱 비밀번호를 올바르게 생성했는지 확인
- 일반 Gmail 비밀번호가 아닌 앱 비밀번호를 사용하는지 확인

### 2. 이메일 전송 실패
```python
# 로그에서 오류 확인
docker-compose logs api
```

일반적인 오류:
- `535 Authentication failed`: 잘못된 인증 정보
- `534 Please log in via your web browser`: 보안 설정 문제
- `Connection refused`: SMTP 서버 또는 포트 문제

### 3. 방화벽 문제
일부 네트워크에서는 SMTP 포트(587, 465)가 차단될 수 있습니다.

### 4. 이메일이 스팸함으로 이동
- 발신자 이메일을 신뢰할 수 있는 발신자로 추가
- SPF, DKIM 레코드 설정 (프로덕션 환경)

## 📋 테스트 방법

### 1. API 테스트
```bash
# 1. 인증 요청
curl -X POST "http://localhost:8000/auth/request-verification" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "your-test-email@gmail.com",
       "password": "testpassword123"
     }'

# 2. 이메일에서 인증 코드 확인 후
curl -X POST "http://localhost:8000/auth/verify-email" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "your-test-email@gmail.com",
       "verification_code": "받은-인증-코드"
     }'
```

### 2. 개발 모드 테스트
이메일 설정 없이 콘솔에서 인증 코드 확인 후 테스트

## 🔐 보안 고려사항

1. **앱 비밀번호 보안**: 앱 비밀번호를 코드에 하드코딩하지 마세요
2. **환경 변수**: 민감한 정보는 환경 변수로 관리
3. **인증 코드 만료**: 기본 10분 만료 시간 설정
4. **재전송 제한**: 동일 이메일로 연속 요청 제한 고려
5. **이메일 검증**: 실제 존재하는 이메일인지 검증

## 📈 프로덕션 환경 권장사항

1. **전용 이메일 서비스**: SendGrid, AWS SES, Mailgun 등 사용
2. **이메일 템플릿**: 브랜드에 맞는 전문적인 템플릿 사용
3. **모니터링**: 이메일 전송 성공률 모니터링
4. **백업 서비스**: 주 서비스 실패 시 백업 SMTP 서비스 준비