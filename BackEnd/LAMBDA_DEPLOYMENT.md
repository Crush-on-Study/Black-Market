# AWS Lambda 컨테이너 배포 가이드

이 가이드는 Black Market API를 AWS Lambda 컨테이너로 배포하는 방법을 설명합니다.

## 📋 사전 준비사항

### 1. AWS CLI 설치 및 설정
```bash
# AWS CLI 설치 확인
aws --version

# AWS 자격 증명 설정
aws configure
```

### 2. Docker 설치
- Docker Desktop이 설치되어 있고 실행 중이어야 합니다.

### 3. 필요한 AWS 서비스
- **ECR (Elastic Container Registry)**: 컨테이너 이미지 저장
- **Lambda**: 서버리스 함수 실행
- **API Gateway**: HTTP API 엔드포인트
- **RDS**: PostgreSQL 데이터베이스 (선택사항)

## 🚀 배포 방법

### 📋 배포 전 체크리스트

1. **AWS CLI 설치 및 설정 확인**
   ```bash
   aws --version
   aws sts get-caller-identity  # 자격 증명 확인
   ```

2. **Docker 실행 확인**
   ```bash
   docker --version
   docker info  # Docker 데몬 실행 상태 확인
   ```

3. **환경 변수 준비**
   - RDS 데이터베이스 연결 문자열
   - JWT 시크릿 키
   - 이메일 서비스 설정 (SMTP)

### 방법 1: PowerShell 스크립트 사용 (Windows) 🪟

```powershell
# 1. BackEnd 디렉토리로 이동
cd BackEnd

# 2. 배포 스크립트 실행
.\deploy.ps1

# 3. 배포 완료 후 환경 변수 설정 (AWS 콘솔에서)
# - DATABASE_URL
# - SECRET_KEY
# - SMTP_USERNAME, SMTP_PASSWORD, FROM_EMAIL
```

**PowerShell 스크립트 동작 과정:**
1. AWS 계정 ID 확인
2. ECR 로그인
3. ECR 리포지토리 생성 (없는 경우)
4. Docker 이미지 빌드
5. ECR에 이미지 푸시
6. Lambda 함수 업데이트

### 방법 2: Bash 스크립트 사용 (Linux/Mac) 🐧🍎

```bash
# 1. BackEnd 디렉토리로 이동
cd BackEnd

# 2. 스크립트 실행 권한 부여
chmod +x deploy.sh

# 3. 배포 스크립트 실행
./deploy.sh
```

### 방법 3: CloudFormation 템플릿 사용 (권장) ☁️

#### 3-1. SAM CLI 사용
```bash
# SAM CLI 설치 확인
sam --version

# 배포 실행
sam deploy \
  --template-file lambda-template.yaml \
  --stack-name black-market-api \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    DatabaseUrl="postgresql://user:pass@host:5432/db" \
    SecretKey="your-jwt-secret-key" \
    SmtpUsername="your-email@gmail.com" \
    SmtpPassword="your-app-password" \
    FromEmail="your-email@gmail.com" \
    VpcSecurityGroupIds="sg-lambda123" \
    SubnetIds="subnet-private1,subnet-private2"
```

#### 3-2. AWS CLI 사용
```bash
# CloudFormation 스택 배포
aws cloudformation deploy \
  --template-file lambda-template.yaml \
  --stack-name black-market-api \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    DatabaseUrl="postgresql://blackmarket_user:secure_password@black-market-db.cluster-xyz.ap-northeast-2.rds.amazonaws.com:5432/blackmarket" \
    SecretKey="your-super-secret-jwt-key-change-this" \
    SmtpUsername="your-email@gmail.com" \
    SmtpPassword="your-gmail-app-password" \
    FromEmail="your-email@gmail.com" \
    VpcSecurityGroupIds="sg-0123456789abcdef0" \
    SubnetIds="subnet-0123456789abcdef0,subnet-0fedcba9876543210"

# 배포 상태 확인
aws cloudformation describe-stacks --stack-name black-market-api
```

### 방법 4: 단계별 수동 배포 🔧

#### 4-1. ECR 리포지토리 생성
```bash
# ECR 리포지토리 생성
aws ecr create-repository \
  --repository-name black-market-api \
  --region ap-northeast-2

# ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | \
docker login --username AWS --password-stdin \
123456789012.dkr.ecr.ap-northeast-2.amazonaws.com
```

#### 4-2. Docker 이미지 빌드 및 푸시
```bash
# 이미지 빌드
docker build -t black-market-api:latest .

# 이미지 태그 지정
docker tag black-market-api:latest \
123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/black-market-api:latest

# ECR에 푸시
docker push 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/black-market-api:latest
```

#### 4-3. Lambda 함수 생성
```bash
# IAM 역할 생성 (먼저 trust-policy.json 파일 생성 필요)
aws iam create-role \
  --role-name lambda-execution-role \
  --assume-role-policy-document file://trust-policy.json

# 기본 실행 정책 연결
aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# VPC 접근 정책 연결 (RDS 사용 시)
aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole

# Lambda 함수 생성
aws lambda create-function \
  --function-name black-market-api \
  --package-type Image \
  --code ImageUri=123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/black-market-api:latest \
  --role arn:aws:iam::123456789012:role/lambda-execution-role \
  --timeout 30 \
  --memory-size 512 \
  --region ap-northeast-2
```

## ⚙️ 환경 변수 설정

Lambda 함수에서 다음 환경 변수를 설정해야 합니다:

### 필수 환경 변수
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `SECRET_KEY`: JWT 토큰 서명용 비밀 키
- `SMTP_USERNAME`: 이메일 서비스 사용자명
- `SMTP_PASSWORD`: 이메일 서비스 비밀번호
- `FROM_EMAIL`: 발신자 이메일 주소

### 선택적 환경 변수
- `ALGORITHM`: JWT 알고리즘 (기본값: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: 액세스 토큰 만료 시간 (기본값: 1440분)
- `SMTP_SERVER`: SMTP 서버 (기본값: smtp.gmail.com)
- `SMTP_PORT`: SMTP 포트 (기본값: 587)

## 🗄️ 데이터베이스 설정

### RDS PostgreSQL 사용 (권장)

#### 1. RDS 인스턴스 생성
```bash
# RDS 인스턴스 생성 (AWS CLI)
aws rds create-db-instance \
    --db-instance-identifier black-market-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username blackmarket_admin \
    --master-user-password YourStrongPassword123! \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxxxxxx \
    --backup-retention-period 7 \
    --storage-encrypted \
    --no-publicly-accessible
```

#### 2. 데이터베이스 및 사용자 생성
```sql
-- RDS에 연결 후 실행
CREATE DATABASE blackmarket;
CREATE USER blackmarket_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE blackmarket TO blackmarket_user;
```

#### 3. 연결 문자열 설정
```bash
# 환경 변수 형식
DATABASE_URL=postgresql://blackmarket_user:secure_password@black-market-db.cluster-xyz.ap-northeast-2.rds.amazonaws.com:5432/blackmarket
```

### Lambda와 RDS 연결 설정

#### VPC 구성 (필수)
Lambda 함수가 RDS에 접근하려면 같은 VPC에 배치해야 합니다:

```yaml
# CloudFormation 템플릿에서
VpcConfig:
  SecurityGroupIds:
    - sg-lambda123  # Lambda 보안 그룹
  SubnetIds:
    - subnet-private1  # 프라이빗 서브넷
    - subnet-private2  # 다른 AZ의 프라이빗 서브넷
```

#### 보안 그룹 설정
```bash
# RDS 보안 그룹에 Lambda 접근 허용
aws ec2 authorize-security-group-ingress \
    --group-id sg-rds123 \
    --protocol tcp \
    --port 5432 \
    --source-group sg-lambda123
```

#### 연결 최적화
현재 `database.py`에서 Lambda 환경에 최적화된 설정을 사용합니다:
- **pool_size**: 1 (Lambda는 단일 연결)
- **max_overflow**: 0 (추가 연결 방지)
- **pool_pre_ping**: True (연결 상태 확인)
- **pool_recycle**: 300초 (연결 재생성)

📋 **자세한 RDS 설정은 `rds-setup.md` 파일을 참조하세요.**

## 🔧 Lambda 함수 설정

### 권장 설정
- **메모리**: 512MB 이상
- **타임아웃**: 30초
- **런타임**: Container Image
- **아키텍처**: x86_64

### IAM 역할 권한
Lambda 실행 역할에 다음 권한이 필요합니다:
- `AWSLambdaBasicExecutionRole`
- `AWSLambdaVPCAccessExecutionRole` (VPC 사용 시)

## 🔧 배포 후 설정

#### 1. 환경 변수 설정
```bash
# Lambda 함수 환경 변수 업데이트
aws lambda update-function-configuration \
  --function-name black-market-api \
  --environment Variables='{
    "DATABASE_URL":"postgresql://user:pass@host:5432/db",
    "SECRET_KEY":"your-jwt-secret-key",
    "ALGORITHM":"HS256",
    "ACCESS_TOKEN_EXPIRE_MINUTES":"1440",
    "SMTP_SERVER":"smtp.gmail.com",
    "SMTP_PORT":"587",
    "SMTP_USERNAME":"your-email@gmail.com",
    "SMTP_PASSWORD":"your-app-password",
    "FROM_EMAIL":"your-email@gmail.com"
  }'
```

#### 2. API Gateway 설정 (수동 배포 시)
```bash
# REST API 생성
aws apigateway create-rest-api \
  --name black-market-api \
  --description "Black Market API Gateway"

# 프록시 리소스 생성 및 Lambda 통합 설정
# (자세한 단계는 AWS 콘솔에서 진행하는 것을 권장)
```

#### 3. VPC 설정 (RDS 연결 시)
```bash
# Lambda 함수 VPC 설정 업데이트
aws lambda update-function-configuration \
  --function-name black-market-api \
  --vpc-config SubnetIds=subnet-12345,subnet-67890,SecurityGroupIds=sg-abcdef
```

## 📊 배포 확인 및 테스트

#### 1. Lambda 함수 테스트
```bash
# 함수 호출 테스트
aws lambda invoke \
  --function-name black-market-api \
  --payload '{"httpMethod":"GET","path":"/","headers":{}}' \
  response.json

# 응답 확인
cat response.json
```

#### 2. API Gateway 엔드포인트 테스트
```bash
# Health check 테스트
curl https://your-api-gateway-url/

# 이메일 인증 요청 테스트
curl -X POST https://your-api-gateway-url/auth/request-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 로그인 테스트
curl -X POST https://your-api-gateway-url/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### 3. 로그 확인
```bash
# CloudWatch 로그 확인
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/black-market-api

# 최근 로그 스트림 확인
aws logs describe-log-streams \
  --log-group-name /aws/lambda/black-market-api \
  --order-by LastEventTime \
  --descending
```

## 🔄 업데이트 배포

#### 코드 변경 후 재배포
```bash
# 1. 새 이미지 빌드
docker build -t black-market-api:latest .

# 2. 새 태그로 푸시
docker tag black-market-api:latest \
123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/black-market-api:v2

docker push 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/black-market-api:v2

# 3. Lambda 함수 코드 업데이트
aws lambda update-function-code \
  --function-name black-market-api \
  --image-uri 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/black-market-api:v2
```

## 🌐 API Gateway 설정

### 프록시 통합 설정
- **리소스**: `{proxy+}`
- **메서드**: `ANY`
- **통합 유형**: Lambda 프록시 통합

### CORS 설정
```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
}
```

## 📊 모니터링 및 로깅

### CloudWatch 로그
- Lambda 함수의 로그는 자동으로 CloudWatch에 저장됩니다.
- 로그 그룹: `/aws/lambda/black-market-api`

### 메트릭 모니터링
- 함수 호출 수
- 오류율
- 응답 시간
- 메모리 사용량

## 🚨 트러블슈팅

### 일반적인 배포 오류 해결

#### 1. ECR 로그인 실패
```bash
# AWS 자격 증명 확인
aws sts get-caller-identity

# 리전 확인
aws configure get region
```

#### 2. Docker 빌드 실패
```bash
# Docker 데몬 상태 확인
docker info

# 빌드 로그 상세 확인
docker build -t black-market-api:latest . --no-cache --progress=plain
```

#### 3. Lambda 함수 실행 오류
```bash
# CloudWatch 로그 확인
aws logs tail /aws/lambda/black-market-api --follow
```

#### 4. RDS 연결 실패
- VPC 설정 확인
- 보안 그룹 규칙 확인
- 데이터베이스 연결 문자열 확인

## 💰 비용 최적화

### Lambda 비용 절약 팁
- 메모리 크기 최적화
- 실행 시간 최소화
- 프로비저닝된 동시성 사용 고려

### RDS 비용 절약 팁
- 적절한 인스턴스 크기 선택
- 예약 인스턴스 사용
- 자동 백업 설정 최적화

## 🔄 CI/CD 파이프라인

GitHub Actions를 사용한 자동 배포 예시:

```yaml
name: Deploy to AWS Lambda

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-2
    
    - name: Deploy to Lambda
      run: |
        cd BackEnd
        ./deploy.sh
```

## 🎯 API 엔드포인트

배포 완료 후 사용 가능한 주요 엔드포인트:

### 인증 관련
- `POST /auth/request-verification` - 이메일 인증 요청
- `POST /auth/verify-email` - 이메일 인증 확인
- `POST /auth/setup-user` - 사용자 정보 설정 및 회원가입 완료
- `POST /auth/login` - 로그인

### 사용자 관리
- `GET /users/` - 사용자 목록 조회
- `GET /users/{user_id}` - 특정 사용자 조회
- `PUT /users/{user_id}` - 사용자 정보 수정
- `DELETE /users/{user_id}` - 사용자 삭제

### 상품 관리
- `POST /listings/` - 상품 등록
- `GET /listings/` - 상품 목록 조회
- `GET /listings/{listing_id}` - 특정 상품 조회
- `PUT /listings/{listing_id}` - 상품 정보 수정
- `DELETE /listings/{listing_id}` - 상품 삭제

이 가이드를 따라하면 Black Market API를 AWS Lambda에 성공적으로 배포할 수 있습니다! 🎉