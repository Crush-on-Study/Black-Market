# 목업 데이터 통합 가이드

## 개요

이 가이드는 프론트엔드의 목업 데이터를 백엔드 데이터베이스에 통합하는 방법을 설명합니다.

## 구현된 기능

### 1. 목업 데이터 JSON 파일 생성

- **파일 위치**: `BackEnd/mock_data.json`
- **포함 데이터**:
  - 거래 데이터 (deals)
  - 업적 데이터 (achievements)
  - 배지 데이터 (badges)
  - 포인트 가격 데이터 (pointPriceData)
  - 최근 거래 내역 (recentTrades)
  - 회사 도메인 매핑 (companyDomainMap)

### 2. 데이터베이스 목업 데이터 로드 기능

#### 주요 함수

- `load_mock_data()`: JSON 파일에서 목업 데이터를 읽어 데이터베이스에 삽입
- `clean_mock_data()`: 기존 목업 데이터를 데이터베이스에서 삭제
- `initialize_database()`: 데이터베이스 테이블 생성 및 목업 데이터 로드

#### 데이터 변환 과정

1. **사용자 생성**: 거래 데이터의 고유한 판매자들을 기반으로 사용자 계정 생성
   - 이메일: `@mockdata.example.com` 도메인 사용 (목업 데이터 식별용)
2. **리스팅 생성**: 거래 데이터를 데이터베이스의 Listing 모델에 맞게 변환
3. **업적 생성**: 업적 데이터를 Achievement 모델에 맞게 변환
   - 이름에 `[MOCK]` 접두사 추가 (목업 데이터 식별용)

#### 목업 데이터 식별 방법

- **사용자**: 이메일이 `@mockdata.example.com`으로 끝나는 계정
- **업적**: 이름이 `[MOCK]`로 시작하는 업적
- **리스팅**: 목업 사용자가 생성한 리스팅

### 3. 환경 변수 설정

#### .env 파일 설정

```env
# Mock Data Configuration
USE_MOCK_DATA=true
```

- `USE_MOCK_DATA=true`: 목업 데이터 로드 활성화
- `USE_MOCK_DATA=false`: 목업 데이터 로드 비활성화 및 기존 목업 데이터 자동 삭제

## 사용 방법

### 1. 환경 설정

1. `.env` 파일에 `USE_MOCK_DATA=true` 추가
2. 데이터베이스 연결 설정 확인

### 2. 서버 시작

```bash
cd BackEnd
python run.py
```

또는

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 3. 목업 데이터 확인

서버 시작 시 로그에서 다음과 같은 메시지 확인:

```
INFO:database:목업 데이터 로드를 시작합니다...
INFO:database:목업 데이터 로드 완료: 사용자 X명, 리스팅 Y개, 업적 Z개
```

## 데이터 구조

### 거래 데이터 (Deals)

```json
{
  "id": 1,
  "title": "고급 식권 포인트 50만점",
  "seller": "익명거래자1",
  "points": 500000,
  "price": 450000,
  "status": "selling",
  "type": "sell",
  "views": 127,
  "sellerRating": 4.8,
  "sellerDeals": 23,
  "company": "고려해운"
}
```

### 업적 데이터 (Achievements)

```json
{
  "id": "first_trade",
  "name": "첫 거래",
  "description": "첫 번째 거래를 완료하세요",
  "category": "trade",
  "requirement": { "type": "trade_count", "value": 1 },
  "reward": { "badge": "first_trade", "exp": 100 },
  "progress": 0,
  "completed": false,
  "completedAt": null,
  "icon": "🎯"
}
```

## 주요 동작 방식

### USE_MOCK_DATA=true인 경우
- 기존 데이터가 있으면 목업 데이터 로드를 건너뜀
- 새로운 목업 데이터를 데이터베이스에 추가

### USE_MOCK_DATA=false인 경우
- 기존 목업 데이터를 자동으로 삭제
- 실제 운영 데이터만 유지

## 주의사항

### 1. 목업 데이터 식별

- 사용자: `@mockdata.example.com` 이메일 도메인
- 업적: `[MOCK]` 접두사가 있는 이름
- 리스팅: 목업 사용자가 생성한 모든 리스팅

### 2. 데이터 무결성

- 외래 키 관계 유지
- 트랜잭션 사용으로 데이터 일관성 보장
- 목업 데이터 삭제 시 관련 데이터도 함께 삭제

### 3. 로깅

- 목업 데이터 로드/삭제 과정의 모든 단계가 로그로 기록됨
- 오류 발생 시 상세한 오류 메시지 제공

## 트러블슈팅

### 1. 목업 데이터가 로드되지 않는 경우

- `.env` 파일의 `USE_MOCK_DATA` 설정 확인
- `mock_data.json` 파일 존재 여부 확인
- 데이터베이스 연결 상태 확인

### 2. 목업 데이터 정리

- `USE_MOCK_DATA=false`로 설정하고 서버 재시작하면 자동으로 목업 데이터 삭제
- 수동으로 목업 데이터만 삭제하고 싶은 경우 `clean_mock_data()` 함수 직접 호출

### 3. JSON 파일 오류

- `mock_data.json` 파일의 JSON 형식 검증
- 인코딩 문제 (UTF-8 사용 권장)

## API 엔드포인트

목업 데이터 로드 후 다음 API를 통해 데이터 확인 가능:

- `GET /users/`: 사용자 목록
- `GET /listings/`: 리스팅 목록
- `GET /achievements/`: 업적 목록

## 개발 팁

### 1. 목업 데이터 수정

`mock_data.json` 파일을 직접 수정하여 테스트 데이터 변경 가능

### 2. 선택적 로드

특정 데이터만 로드하고 싶은 경우 `load_mock_data()` 함수 수정

### 3. 프로덕션 환경

프로덕션 환경에서는 반드시 `USE_MOCK_DATA=false` 설정

## 향후 개선사항

1. 목업 데이터 업데이트 API 엔드포인트 추가
2. 목업 데이터 버전 관리
3. 더 다양한 테스트 시나리오 데이터 추가
4. 목업 데이터 검증 기능 강화