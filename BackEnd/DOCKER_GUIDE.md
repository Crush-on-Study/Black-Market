# Black Market Docker 가이드

## 🐳 Docker를 사용한 실행 방법

### 전제 조건
- Docker 및 Docker Compose 설치 필요
- Windows: Docker Desktop
- macOS: Docker Desktop
- Linux: Docker Engine + Docker Compose

### 1. 프로젝트 클론 및 디렉토리 이동
```bash
git clone https://github.com/your-username/black-market.git
cd black-market/BackEnd
```

### 2. 환경 변수 설정
`.env` 파일이 이미 생성되어 있습니다. 필요에 따라 수정하세요:
```bash
# .env 파일 내용 확인
cat .env
```

### 3. Docker Compose로 전체 스택 실행
```bash
# 백그라운드에서 실행
docker-compose up -d

# 로그 확인하며 실행
docker-compose up
```

### 4. 서비스 접근
- **FastAPI 애플리케이션**: http://localhost:8000
- **API 문서 (Swagger)**: http://localhost:8000/docs
- **pgAdmin (데이터베이스 관리)**: http://localhost:5050
  - 이메일: admin@blackmarket.com
  - 비밀번호: admin123

### 5. 서비스 중지
```bash
# 컨테이너 중지
docker-compose down

# 볼륨까지 삭제 (데이터베이스 데이터 삭제됨)
docker-compose down -v
```

## 🔧 개발 모드

### 코드 변경 시 자동 리로드
Docker Compose 설정에서 볼륨 마운트가 되어 있어 코드 변경 시 자동으로 리로드됩니다.

### 개별 서비스 재시작
```bash
# API 서비스만 재시작
docker-compose restart api

# 데이터베이스만 재시작
docker-compose restart db
```

### 로그 확인
```bash
# 모든 서비스 로그
docker-compose logs

# 특정 서비스 로그
docker-compose logs api
docker-compose logs db

# 실시간 로그 확인
docker-compose logs -f api
```

## 🗄️ 데이터베이스 관리

### pgAdmin 사용
1. http://localhost:5050 접속
2. 로그인 (admin@blackmarket.com / admin123)
3. 서버 추가:
   - Name: BlackMarket DB
   - Host: db
   - Port: 5432
   - Database: blackmarket
   - Username: blackmarket_user
   - Password: blackmarket_password

### 직접 PostgreSQL 접속
```bash
# 컨테이너 내부 접속
docker-compose exec db psql -U blackmarket_user -d blackmarket

# 또는 로컬에서 접속 (PostgreSQL 클라이언트 필요)
psql -h localhost -p 5432 -U blackmarket_user -d blackmarket
```

### 데이터베이스 백업
```bash
# 백업 생성
docker-compose exec db pg_dump -U blackmarket_user blackmarket > backup.sql

# 백업 복원
docker-compose exec -T db psql -U blackmarket_user blackmarket < backup.sql
```

## 🚀 프로덕션 배포

### 환경 변수 수정
프로덕션 환경에서는 다음 값들을 반드시 변경하세요:
```env
SECRET_KEY=your-production-secret-key-here
POSTGRES_PASSWORD=strong-production-password
PGADMIN_DEFAULT_PASSWORD=strong-admin-password
```

### 프로덕션용 Docker Compose
```bash
# 프로덕션용 설정 파일 생성
cp docker-compose.yml docker-compose.prod.yml
```

프로덕션용 설정에서 수정할 사항:
- `restart: always` 추가
- 볼륨 마운트 제거 (코드 변경 시 리로드 불필요)
- 포트 설정 조정
- 보안 설정 강화

## 🔍 트러블슈팅

### 포트 충돌
```bash
# 사용 중인 포트 확인
netstat -tulpn | grep :8000
netstat -tulpn | grep :5432

# 다른 포트 사용 시 docker-compose.yml 수정
```

### 데이터베이스 연결 오류
```bash
# 데이터베이스 컨테이너 상태 확인
docker-compose ps

# 데이터베이스 로그 확인
docker-compose logs db

# 헬스체크 확인
docker-compose exec db pg_isready -U blackmarket_user -d blackmarket
```

### 컨테이너 재빌드
```bash
# 이미지 재빌드
docker-compose build --no-cache

# 컨테이너 재생성
docker-compose up --force-recreate
```

### 볼륨 초기화
```bash
# 모든 볼륨 삭제 (데이터 손실 주의!)
docker-compose down -v
docker volume prune
```

## 📊 모니터링

### 컨테이너 상태 확인
```bash
# 실행 중인 컨테이너 확인
docker-compose ps

# 리소스 사용량 확인
docker stats
```

### 애플리케이션 헬스체크
```bash
# API 헬스체크
curl http://localhost:8000/

# 데이터베이스 헬스체크
docker-compose exec db pg_isready -U blackmarket_user -d blackmarket
```

## 🔐 보안 고려사항

1. **비밀번호 변경**: 기본 비밀번호를 강력한 비밀번호로 변경
2. **포트 제한**: 프로덕션에서는 필요한 포트만 노출
3. **네트워크 분리**: 외부 접근이 필요하지 않은 서비스는 내부 네트워크만 사용
4. **SSL/TLS**: 프로덕션에서는 HTTPS 설정 필수
5. **방화벽**: 적절한 방화벽 규칙 설정