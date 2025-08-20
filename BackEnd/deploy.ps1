# AWS Lambda 컨테이너 배포 PowerShell 스크립트

# 변수 설정
$AWS_REGION = "ap-northeast-2"  # 서울 리전
$ECR_REPOSITORY_NAME = "black-market-api"
$LAMBDA_FUNCTION_NAME = "black-market-api"
$IMAGE_TAG = "latest"

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# AWS 계정 ID 가져오기
try {
    $AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to get AWS account ID"
    }
} catch {
    Write-Host "❌ Error: Unable to get AWS account ID. Please check your AWS credentials." -ForegroundColor Red
    exit 1
}

# ECR 리포지토리 URI
$ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY_NAME}"

# 1. ECR 로그인
Write-Host "📝 Logging in to ECR..." -ForegroundColor Yellow
try {
    $loginCommand = aws ecr get-login-password --region $AWS_REGION
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to get ECR login password"
    }
    $loginCommand | docker login --username AWS --password-stdin $ECR_URI
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to login to ECR"
    }
} catch {
    Write-Host "❌ Error: ECR login failed. $_" -ForegroundColor Red
    exit 1
}

# 2. ECR 리포지토리 생성 (존재하지 않는 경우)
Write-Host "📦 Creating ECR repository if it doesn't exist..." -ForegroundColor Yellow
try {
    aws ecr describe-repositories --repository-names $ECR_REPOSITORY_NAME --region $AWS_REGION 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creating new ECR repository..." -ForegroundColor Cyan
        aws ecr create-repository --repository-name $ECR_REPOSITORY_NAME --region $AWS_REGION
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to create ECR repository"
        }
    }
} catch {
    Write-Host "❌ Error: Failed to create ECR repository. $_" -ForegroundColor Red
    exit 1
}

# 3. Docker 이미지 빌드
Write-Host "🔨 Building Docker image..." -ForegroundColor Yellow
try {
    docker build -t "${ECR_REPOSITORY_NAME}:${IMAGE_TAG}" .
    if ($LASTEXITCODE -ne 0) {
        throw "Docker build failed"
    }
} catch {
    Write-Host "❌ Error: Docker build failed. $_" -ForegroundColor Red
    exit 1
}

# 4. 이미지 태그 지정
Write-Host "🏷️  Tagging image..." -ForegroundColor Yellow
try {
    docker tag "${ECR_REPOSITORY_NAME}:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"
    if ($LASTEXITCODE -ne 0) {
        throw "Docker tag failed"
    }
} catch {
    Write-Host "❌ Error: Docker tag failed. $_" -ForegroundColor Red
    exit 1
}

# 5. ECR에 이미지 푸시
Write-Host "📤 Pushing image to ECR..." -ForegroundColor Yellow
try {
    docker push "${ECR_URI}:${IMAGE_TAG}"
    if ($LASTEXITCODE -ne 0) {
        throw "Docker push failed"
    }
} catch {
    Write-Host "❌ Error: Docker push failed. $_" -ForegroundColor Red
    exit 1
}

# 6. Lambda 함수 업데이트 또는 생성
Write-Host "⚡ Updating Lambda function..." -ForegroundColor Yellow
try {
    # 먼저 함수 업데이트 시도
    aws lambda update-function-code --function-name $LAMBDA_FUNCTION_NAME --image-uri "${ECR_URI}:${IMAGE_TAG}" --region $AWS_REGION 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Function doesn't exist, creating new one..." -ForegroundColor Cyan
        # 함수가 없으면 새로 생성 (IAM 역할이 필요함)
        Write-Host "⚠️  Warning: You need to create the Lambda function manually or use CloudFormation template." -ForegroundColor Yellow
        Write-Host "Use the lambda-template.yaml file for CloudFormation deployment." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error: Lambda function update failed. $_" -ForegroundColor Red
    Write-Host "💡 Tip: Use 'aws cloudformation deploy' with lambda-template.yaml for initial setup." -ForegroundColor Cyan
}

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Lambda function: $LAMBDA_FUNCTION_NAME" -ForegroundColor Cyan
Write-Host "📦 ECR image: ${ECR_URI}:${IMAGE_TAG}" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure environment variables in Lambda console" -ForegroundColor White
Write-Host "2. Set up API Gateway if not using CloudFormation" -ForegroundColor White
Write-Host "3. Configure RDS database connection" -ForegroundColor White