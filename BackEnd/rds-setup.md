# AWS RDS PostgreSQL 설정 가이드

이 가이드는 Black Market API를 위한 AWS RDS PostgreSQL 데이터베이스 설정 방법을 설명합니다.

## 🗄️ RDS PostgreSQL 인스턴스 생성

### 1. AWS 콘솔에서 RDS 생성

#### 기본 설정
- **엔진**: PostgreSQL
- **버전**: PostgreSQL 15.x (최신 안정 버전)
- **템플릿**: 프로덕션 또는 개발/테스트
- **DB 인스턴스 식별자**: `black-market-db`

#### 자격 증명 설정
- **마스터 사용자 이름**: `blackmarket_admin`
- **마스터 암호**: 강력한 암호 설정 (AWS Secrets Manager 사용 권장)

#### 인스턴스 구성
- **DB 인스턴스 클래스**: 
  - 개발: `db.t3.micro` (프리 티어)
  - 프로덕션: `db.t3.small` 이상
- **스토리지**: 
  - 스토리지 유형: 범용 SSD (gp2)
  - 할당된 스토리지: 20GB (최소)
  - 스토리지 자동 조정: 활성화

#### 연결
- **VPC**: 기본 VPC 또는 사용자 정의 VPC
- **서브넷 그룹**: 기본값 또는 사용자 정의
- **퍼블릭 액세스**: 아니요 (보안상 권장)
- **VPC 보안 그룹**: 새로 생성 또는 기존 그룹 사용

### 2. AWS CLI로 RDS 생성

```bash
# RDS 서브넷 그룹 생성
aws rds create-db-subnet-group \
    --db-subnet-group-name black-market-subnet-group \
    --db-subnet-group-description "Subnet group for Black Market DB" \
    --subnet-ids subnet-12345678 subnet-87654321

# RDS 인스턴스 생성
aws rds create-db-instance \
    --db-instance-identifier black-market-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username blackmarket_admin \
    --master-user-password YourStrongPassword123! \
    --allocated-storage 20 \
    --db-subnet-group-name black-market-subnet-group \
    --vpc-security-group-ids sg-12345678 \
    --backup-retention-period 7 \
    --storage-encrypted \
    --no-publicly-accessible
```

## 🔐 보안 그룹 설정

### Lambda용 보안 그룹 생성
```bash
# Lambda 보안 그룹 생성
aws ec2 create-security-group \
    --group-name lambda-sg \
    --description "Security group for Lambda functions"

# 아웃바운드 규칙 (모든 트래픽 허용)
aws ec2 authorize-security-group-egress \
    --group-id sg-lambda123 \
    --protocol -1 \
    --cidr 0.0.0.0/0
```

### RDS용 보안 그룹 설정
```bash
# RDS 보안 그룹에 Lambda 접근 허용
aws ec2 authorize-security-group-ingress \
    --group-id sg-rds123 \
    --protocol tcp \
    --port 5432 \
    --source-group sg-lambda123
```

## 🔧 데이터베이스 초기 설정

### 1. 데이터베이스 및 사용자 생성

RDS 인스턴스에 연결하여 애플리케이션용 데이터베이스와 사용자를 생성합니다:

```sql
-- 관리자로 연결 후 실행
CREATE DATABASE blackmarket;
CREATE USER blackmarket_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE blackmarket TO blackmarket_user;

-- blackmarket 데이터베이스로 전환
\c blackmarket

-- 스키마 권한 부여
GRANT ALL ON SCHEMA public TO blackmarket_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO blackmarket_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO blackmarket_user;

-- 향후 생성될 테이블에 대한 권한
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO blackmarket_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO blackmarket_user;
```

### 2. 연결 문자열 구성

```bash
# 기본 형식
DATABASE_URL=postgresql://username:password@endpoint:port/database

# 실제 예시
DATABASE_URL=postgresql://blackmarket_user:secure_password_here@black-market-db.cluster-xyz.ap-northeast-2.rds.amazonaws.com:5432/blackmarket
```

## 🚀 Lambda와 RDS 연결 설정

### 1. Lambda 함수 VPC 설정

Lambda 함수가 RDS에 접근하려면 같은 VPC 내에 있어야 합니다:

```yaml
# CloudFormation 템플릿에서
VpcConfig:
  SecurityGroupIds:
    - sg-lambda123  # Lambda 보안 그룹
  SubnetIds:
    - subnet-private1  # 프라이빗 서브넷
    - subnet-private2  # 다른 AZ의 프라이빗 서브넷
```

### 2. IAM 역할 권한 추가

Lambda 실행 역할에 VPC 접근 권한 추가:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface",
        "ec2:AttachNetworkInterface",
        "ec2:DetachNetworkInterface"
      ],
      "Resource": "*"
    }
  ]
}
```

## 📊 모니터링 및 성능 최적화

### 1. CloudWatch 메트릭 모니터링
- **DatabaseConnections**: 활성 연결 수
- **CPUUtilization**: CPU 사용률
- **FreeableMemory**: 사용 가능한 메모리
- **ReadLatency/WriteLatency**: 읽기/쓰기 지연 시간

### 2. 성능 최적화 설정

#### PostgreSQL 파라미터 그룹 생성
```bash
aws rds create-db-parameter-group \
    --db-parameter-group-name black-market-postgres-params \
    --db-parameter-group-family postgres15 \
    --description "Custom parameters for Black Market DB"
```

#### 권장 파라미터 설정
```bash
# 연결 관련 설정
aws rds modify-db-parameter-group \
    --db-parameter-group-name black-market-postgres-params \
    --parameters "ParameterName=max_connections,ParameterValue=100,ApplyMethod=pending-reboot"

# 메모리 설정
aws rds modify-db-parameter-group \
    --db-parameter-group-name black-market-postgres-params \
    --parameters "ParameterName=shared_preload_libraries,ParameterValue=pg_stat_statements,ApplyMethod=pending-reboot"
```

## 🔄 백업 및 복구

### 1. 자동 백업 설정
- **백업 보존 기간**: 7일 (최소 권장)
- **백업 윈도우**: 트래픽이 적은 시간대 설정
- **유지 관리 윈도우**: 백업 윈도우와 다른 시간대 설정

### 2. 스냅샷 생성
```bash
# 수동 스냅샷 생성
aws rds create-db-snapshot \
    --db-instance-identifier black-market-db \
    --db-snapshot-identifier black-market-db-snapshot-$(date +%Y%m%d)
```

## 🔒 보안 모범 사례

### 1. 암호화
- **저장 시 암호화**: 활성화
- **전송 중 암호화**: SSL/TLS 사용 강제

### 2. 접근 제어
- **퍼블릭 액세스**: 비활성화
- **보안 그룹**: 최소 권한 원칙 적용
- **IAM 데이터베이스 인증**: 고려 (선택사항)

### 3. 모니터링
- **Performance Insights**: 활성화
- **Enhanced Monitoring**: 활성화
- **로그 내보내기**: CloudWatch로 PostgreSQL 로그 전송

## 💰 비용 최적화

### 1. 인스턴스 크기 최적화
- 초기에는 작은 인스턴스로 시작
- CloudWatch 메트릭을 통해 사용량 모니터링
- 필요에 따라 스케일 업/다운

### 2. 예약 인스턴스
- 1년 또는 3년 예약으로 비용 절약
- 안정적인 워크로드에 적합

### 3. 스토리지 최적화
- 자동 스토리지 조정 활성화
- 사용하지 않는 스냅샷 정리

## 🧪 연결 테스트

### 1. Lambda 함수에서 테스트
```python
import psycopg2
import os

def test_db_connection():
    try:
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        cursor = conn.cursor()
        cursor.execute('SELECT version();')
        version = cursor.fetchone()
        print(f"PostgreSQL version: {version}")
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False
```

### 2. 로컬에서 테스트 (VPN 또는 Bastion Host 사용)
```bash
# psql 클라이언트로 연결 테스트
psql "postgresql://blackmarket_user:password@your-rds-endpoint:5432/blackmarket"
```

aws cloudformation deploy \
  --template-file lambda-template.yaml \
  --stack-name black-market-api \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    DatabaseUrl="postgresql://user:pass@rds-endpoint:5432/blackmarket" \
    SecretKey="your-jwt-secret-key" \
    SmtpUsername="your-email@gmail.com" \
    SmtpPassword="your-app-password" \
    FromEmail="your-email@gmail.com" \
    VpcSecurityGroupIds="sg-lambda123" \
    SubnetIds="subnet-private1,subnet-private2"

이 가이드를 따라하면 AWS RDS PostgreSQL과 Lambda를 안전하고 효율적으로 연결할 수 있습니다! 🎉