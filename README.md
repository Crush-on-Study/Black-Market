# ⚡ Black Market - 식권포인트 P2P 거래 플랫폼

**Version**: 1.0.1  
**Status**: Frontend 초기 작업 완료 (백엔드 연동 필요)  
**Last Updated**: 2025년 8월 13일

## 📋 프로젝트 개요

식권포인트를 P2P로 거래할 수 있는 암거래 시장 테마의 웹 플랫폼입니다.  
사이버펑크 스타일의 다크 테마와 고대비 디자인을 적용하여 독특한 사용자 경험을 제공합니다.

### 🎯 주요 기능
- **회원가입/로그인**: 회사별 도메인 검증, 이메일 인증
- **거래 등록**: 판매/구매 포인트 등록 및 관리
- **거래 검색**: 제목, 작성자, 상태별 필터링
- **실시간 차트**: 포인트 가격 변동 추이
- **사용자 프로필**: 아바타 업로드, 닉네임 관리
- **쪽지 시스템**: 거래자 간 1:1 소통

## 🚀 시작하기
### 설치 및 실행

```bash
# 1. 프로젝트 클론
git clone [repository-url]
cd BlackMarket

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# http://localhost:5173
```

### 📦 설치되는 주요 패키지

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.0.0",
    "zustand": "^4.0.0",
    "recharts": "^2.0.0",
    "three": "^0.160.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}
```

## 🏗️ 프로젝트 구조

```
BlackMarket/
├── public/                     # 🌐 정적 자산
│   └── default-avatar.svg     # 기본 아바타 이미지
├── src/                       # 📁 소스 코드
│   ├── components/            # 🔧 재사용 컴포넌트
│   │   ├── Button.jsx        # StarBorder 기반 커스텀 버튼
│   │   ├── Header.jsx        # 메인 페이지 헤더
│   │   ├── Input.jsx         # 입력 필드 컴포넌트
│   │   ├── Card.jsx          # 카드 컨테이너
│   │   ├── SignupModal.jsx   # 다단계 회원가입 모달
│   │   ├── SearchableSelect.jsx # 검색 가능한 드롭다운
│   │   ├── RotatingPartners.jsx # 회전하는 파트너 로고
│   │   ├── Breadcrumb.jsx    # 다단계 프로세스 네비게이션
│   │   ├── SellModal.jsx     # 판매 등록 모달
│   │   ├── BuyModal.jsx      # 구매 등록 모달
│   │   ├── Pagination.jsx    # 페이지네이션 컴포넌트
│   │   ├── MessageModal.jsx  # 쪽지 전송 모달
│   │   └── DropdownSelect.jsx # 커스텀 드롭다운 셀렉트박스
│   ├── pages/                 # 📄 페이지 컴포넌트
│   │   ├── LoginPage.jsx     # 로그인 페이지
│   │   └── MainPage.jsx      # 메인 대시보드
│   ├── stores/                # 🗄️ 상태 관리
│   │   └── mainStore.js      # Zustand 기반 메인 상태 스토어
│   ├── router/                # 🛣️ 라우팅 관리
│   │   └── index.jsx         # SSOT 방식 라우터 설정
│   ├── styles/                # 🎨 스타일 파일
│   │   ├── components/       # 🔧 컴포넌트별 스타일
│   │   │   ├── Button.css    # StarBorder 기반 버튼 스타일
│   │   │   ├── Header.css    # 헤더 스타일
│   │   │   ├── Input.css     # 입력 필드 스타일
│   │   │   ├── Card.css      # 카드 스타일
│   │   │   ├── SignupModal.css # 회원가입 모달 스타일
│   │   │   ├── SearchableSelect.css # 검색 셀렉트 스타일
│   │   │   ├── RotatingPartners.css # 파트너사 스타일
│   │   │   ├── Breadcrumb.css # 브레드크럼 스타일
│   │   │   ├── Pagination.css # 페이지네이션 스타일
│   │   │   ├── SellModal.css  # 판매등록 모달 스타일
│   │   │   ├── BuyModal.css   # 구매등록 모달 스타일
│   │   │   ├── MessageModal.css # 쪽지 모달 스타일
│   │   │   └── DropdownSelect.css # 드롭다운 셀렉트박스 스타일
│   │   ├── pages/            # 📄 페이지별 스타일
│   │   │   ├── LoginPage.css # 로그인 페이지 스타일
│   │   │   └── MainPage.css  # 메인 페이지 스타일
│   │   └── external/         # 🌐 외부 컴포넌트 스타일
│   │       └── Hyperspeed.css # Hyperspeed 배경 스타일
│   ├── external/              # 🌐 외부 라이브러리
│   │   └── Hyperspeed.jsx    # Three.js 기반 배경 애니메이션
│   ├── App.jsx                # 🎯 메인 앱 컴포넌트
│   ├── App.css                # 🌍 전역 스타일
│   └── main.jsx               # 🚀 앱 진입점
├── package.json               # 📦 프로젝트 설정 및 의존성
├── vite.config.js             # ⚡ Vite 빌드 설정
└── README.md                  # 📖 프로젝트 문서
```

## 🎯 아키텍처 설계

### 1. **엔트리포인트 (main.jsx)**
- React 앱의 시작점
- 전역 스타일 및 라우터 설정

### 2. **중앙집중형 앱 (App.jsx)**
- 전체 앱의 상태 관리
- Suspense를 통한 코드 스플리팅
- 라우터 설정 및 전역 컨텍스트

### 3. **SSOT 라우터 (router/index.jsx)**
- Single Source of Truth 방식
- 모든 라우트 정의 및 가드 관리
- Lazy loading을 통한 코드 스플리팅

### 4. **컴포넌트 시스템**
- **Button**: StarBorder 기반 커스텀 버튼 (투명 배경, 애니메이션 테두리)
- **Input**: 일관된 스타일링
- **Card**: 재사용 가능한 컨테이너
- **Modal**: 오버레이 기반 인터페이스
- **DropdownSelect**: 커스텀 스타일의 드롭다운 셀렉트박스

### 5. **상태 관리 (Zustand)**
- **중앙화된 상태**: 15개의 useState를 하나의 store로 통합
- **타입 안전성**: 명확한 액션과 computed values
- **성능 최적화**: 필요한 상태만 구독하여 리렌더링 최소화

### 6. **스타일 구조화**
- **components/**: 재사용 컴포넌트별 스타일
- **pages/**: 페이지별 전용 스타일
- **external/**: 외부 라이브러리 스타일
- **App.css**: 전역 스타일 (루트 디렉토리)

## 🎨 디자인 시스템

### **색상 팔레트**
- **Primary**: `#00d4ff` (사이버펑크 블루)
- **Background**: `#000000` (순수 검은)
- **Text**: `#ffffff` (흰색)
- **Success**: `#00ff88` (초록)
- **Error**: `#ff0066` (빨강)

### **타이포그래피**
- **Font**: Arial (전역 통일)
- **Weight**: 400, 600, 700
- **Size**: 12px ~ 32px

### **간격 시스템**
- **Small**: 8px, 12px
- **Medium**: 16px, 20px, 24px
- **Large**: 30px, 32px, 40px

## 🚀 주요 기능

### **로그인 시스템**
- 이메일/비밀번호 인증
- 회사별 도메인 검증 (고려해운, 테스콤, 삼성카드)
- Hyperspeed 배경 애니메이션

### **회원가입 프로세스**
- 5단계 브레드크럼 네비게이션
- 회사 선택 → 기본정보 → 닉네임 → 이메일인증 → 완료
- 모달 기반 인터페이스

### **메인 대시보드**
- Bento 레이아웃 (왼쪽: 거래목록, 오른쪽: 차트/통계)
- 실시간 포인트 가격 차트 (Recharts)
- 회사별 거래 필터링
- 판매자 정보 모달
- 구매/판매 등록 모달

### **거래 관리**
- 판매/구매 포인트 등록
- 실시간 검색 및 필터링
- 페이지네이션 (게시글별)
- 쪽지 시스템

## 🔧 기술 스택

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM
- **State Management**: Zustand
- **Styling**: CSS Modules + Custom Properties
- **3D Graphics**: Three.js
- **Charts**: Recharts
- **Build Tool**: Vite

## 📱 반응형 디자인

- **Desktop**: 1200px+ (2열 Bento 레이아웃)
- **Tablet**: 768px ~ 1200px (조정된 간격)
- **Mobile**: 768px 이하 (세로 배치)

## 🎭 애니메이션 시스템

- **진입**: 단계별 딜레이 (0.2s ~ 0.8s)
- **전환**: 0.3s ease
- **호버**: transform + box-shadow 효과
- **로딩**: 스피너 + 페이드인
- **배경**: Three.js 기반 Hyperspeed 애니메이션

## 🧹 코드 품질

- **코드 스플리팅**: React.lazy + Suspense
- **레이지 로딩**: 무거운 컴포넌트들의 지연 로딩
- **상태 관리**: Zustand를 통한 중앙화된 상태 관리
- **컴포넌트 분리**: 재사용 가능한 UI 컴포넌트
- **타입 안전성**: 명확한 인터페이스와 액션 정의

## 🔄 개발 가이드

### **현재 상태**
프론트엔드는 완성되었지만, 모든 데이터는 Mock 데이터로 구성되어 있습니다.  
백엔드 개발자와 협업하여 실제 API 연동이 필요합니다.


### **보안 고려사항**
- **JWT 토큰**: Access Token + Refresh Token 구현
- **비밀번호**: bcrypt를 사용한 해싱
- **CORS**: 프론트엔드 도메인만 허용
- **Rate Limiting**: API 요청 제한
- **Input Validation**: 모든 입력값 검증
- **SQL Injection 방지**: Prepared Statements 사용

### **성능 최적화**
- **데이터베이스 인덱싱**: 자주 조회되는 컬럼에 인덱스 추가
- **캐싱**: Redis를 사용한 세션 및 데이터 캐싱
- **페이지네이션**: 커서 기반 페이지네이션 구현
- **이미지 최적화**: WebP 포맷 지원 및 리사이징

## 🚀 배포 가이드

### **프로덕션 빌드**
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물 확인
npm run preview
```

### **환경별 설정**
```bash
# 개발 환경
npm run dev

# 프로덕션 환경
npm run build
npm run preview
```

## 🤝 기여하기

### **개발 환경 설정**
1. 프로젝트 포크
2. 로컬에 클론
3. `npm install`로 의존성 설치
4. `npm run dev`로 개발 서버 실행

### **코드 컨벤션**
- **컴포넌트**: PascalCase (예: `UserProfile.jsx`)
- **함수**: camelCase (예: `handleUserClick`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_FILE_SIZE`)
- **CSS 클래스**: kebab-case (예: `user-profile`)

### **커밋 메시지**
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 프로세스 변경
```

**⚡ Black Market v1.0.1** - 사이버펑크 테마의 식권포인트 P2P 거래 플랫폼
