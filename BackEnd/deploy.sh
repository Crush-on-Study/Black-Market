#!/bin/bash

# AWS Lambda 컨테이너 배포 스크립트

# 변수 설정
AWS_REGION="ap-northeast-2"  # 서울 리전
ECR_REPOSITORY_NAME="black-market-api"
LAMBDA_FUNCTION_NAME="black-market-api"
IMAGE_TAG="latest"

# AWS 계정 ID 가져오기
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# ECR 리포지토리 URI
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY_NAME}"

echo "🚀 Starting deployment process..."

# 1. ECR 로그인
echo "📝 Logging in to ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}

# 2. ECR 리포지토리 생성 (존재하지 않는 경우)
echo "📦 Creating ECR repository if it doesn't exist..."
aws ecr describe-repositories --repository-names ${ECR_REPOSITORY_NAME} --region ${AWS_REGION} 2>/dev/null || \
aws ecr create-repository --repository-name ${ECR_REPOSITORY_NAME} --region ${AWS_REGION}

# 3. Docker 이미지 빌드
echo "🔨 Building Docker image..."
docker build -t ${ECR_REPOSITORY_NAME}:${IMAGE_TAG} .

# 4. 이미지 태그 지정
echo "🏷️  Tagging image..."
docker tag ${ECR_REPOSITORY_NAME}:${IMAGE_TAG} ${ECR_URI}:${IMAGE_TAG}

# 5. ECR에 이미지 푸시
echo "📤 Pushing image to ECR..."
docker push ${ECR_URI}:${IMAGE_TAG}

# 6. Lambda 함수 업데이트 (존재하는 경우) 또는 생성
echo "⚡ Updating Lambda function..."
aws lambda update-function-code \
    --function-name ${LAMBDA_FUNCTION_NAME} \
    --image-uri ${ECR_URI}:${IMAGE_TAG} \
    --region ${AWS_REGION} 2>/dev/null || \
aws lambda create-function \
    --function-name ${LAMBDA_FUNCTION_NAME} \
    --package-type Image \
    --code ImageUri=${ECR_URI}:${IMAGE_TAG} \
    --role arn:aws:iam::${AWS_ACCOUNT_ID}:role/lambda-execution-role \
    --timeout 30 \
    --memory-size 512 \
    --region ${AWS_REGION}

echo "✅ Deployment completed!"
echo "🌐 Lambda function: ${LAMBDA_FUNCTION_NAME}"
echo "📦 ECR image: ${ECR_URI}:${IMAGE_TAG}"