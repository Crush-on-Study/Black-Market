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

### 방법 1: PowerShell 스크립트 사용 (Windows)
```powershell
# BackEnd 디렉토리에서 실행
.\deploy.ps1
```

### 방법 2: Bash 스크립트 사용 (Linux/Mac)
```bash
# BackEnd 디렉토리에서 실행
chmod +x deploy.sh
./deploy.sh
```

### 방법 3: CloudFormation 템플릿 사용 (권장)
```bash
# SAM CLI 사용
sam deploy --template-file lambda-template.yaml --stack-name black-market-api --capabilities CAPABILITY_IAM

# 또는 AWS CLI 사용
aws cloudformation deploy \
  --template-file lambda-template.yaml \
  --stack-name black-market-api \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    DatabaseUrl="postgresql://user:pass@host:5432/db" \
    SecretKey="your-secret-key" \
    SmtpUsername="your-email@gmail.com" \
    SmtpPassword="your-app-password" \
    FromEmail="your-email@gmail.com"
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

## 🔍 트러블슈팅

### 일반적인 문제들

#### 1. 컨테이너 빌드 실패
```bash
# Docker 데몬이 실행 중인지 확인
docker info

# 이미지 빌드 로그 확인
docker build -t black-market-api:latest . --no-cache
```

#### 2. ECR 푸시 실패
```bash
# ECR 로그인 상태 확인
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com
```

#### 3. Lambda 함수 실행 오류
- CloudWatch 로그에서 오류 메시지 확인
- 환경 변수 설정 확인
- VPC 및 보안 그룹 설정 확인

#### 4. 데이터베이스 연결 실패
- RDS 보안 그룹 설정 확인
- Lambda 함수의 VPC 설정 확인
- 데이터베이스 연결 문자열 확인

## 📝 배포 후 확인사항

1. **API 엔드포인트 테스트**
   ```bash
   curl https://your-api-gateway-url/
   ```

2. **데이터베이스 연결 확인**
   - `/users/` 엔드포인트 호출
   - 테이블 생성 확인

3. **이메일 서비스 테스트**
   - 이메일 인증 요청 테스트

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
CloudFormation 사용 (권장)

aws cloudformation deploy \
  --template-file lambda-template.yaml \
  --stack-name black-market-api \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    DatabaseUrl="your-db-url" \
    SecretKey="your-secret-key" \
    SmtpUsername="your-email" \
    SmtpPassword="your-password" \
    FromEmail="your-email"


이 가이드를 따라하면 Black Market API를 AWS Lambda에 성공적으로 배포할 수 있습니다! 🎉