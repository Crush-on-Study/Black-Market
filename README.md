# 🚀 Black Market - 회사 내부 포인트 거래 플랫폼

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite)
![Zustand](https://img.shields.io/badge/Zustand-4.4.0-764ABC?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.0-009688?style=for-the-badge&logo=fastapi)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

</div>

## 📖 프로젝트 소개

**Black Market**은 회사 내부 포인트 거래 플랫폼입니다. 식권포인트를 시작으로, 추후 상품권 등 다양한 포인트를 같은 회사 사람끼리 안전하고 효율적으로 거래할 수 있도록 설계되었습니다.

### ✨ 주요 기능

- 🔐 **보안 인증**: 회사 이메일 도메인 기반 인증
- 💼 **포인트 거래**: 판매/구매 등록 및 거래 매칭
- 🏆 **업적 시스템**: 거래 활동 기반 레벨업 및 배지 획득
- 💬 **실시간 채팅**: 거래자 간 소통 및 협상
- 📱 **반응형 웹**: 모든 디바이스에서 최적화된 경험
- 🎨 **사이버펑크 테마**: 독특하고 매력적인 UI/UX

## 🛠️ 기술 스택

### Frontend
- **React 18.2.0** - 사용자 인터페이스 구축
- **Vite 5.0.0** - 빠른 개발 및 빌드 도구
- **Zustand 4.4.0** - 상태 관리
- **React Router DOM** - 클라이언트 사이드 라우팅
- **CSS3** - 커스텀 스타일링 및 애니메이션

### Backend
- **Python 3.10+** - 서버 사이드 로직
- **FastAPI** - 고성능 웹 API 프레임워크
- **PostgreSQL** - 관계형 데이터베이스
- **AWS** - 클라우드 인프라 및 배포

### 개발 도구
- **ESLint** - 코드 품질 관리
- **Git** - 버전 관리
- **VS Code** - 개발 환경

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 9.0.0 이상
- Python 3.10 이상

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/your-username/black-market.git
cd black-market
```

2. **Frontend 의존성 설치**
```bash
npm install
```

3. **개발 서버 실행**
```bash
npm run dev
```

4. **브라우저에서 확인**
```
http://localhost:5173
```

### 빌드
```bash
npm run build
```

### 테스트
```bash
npm test
```

## 📁 프로젝트 구조

```
BlackMarket/
├── public/                 # 정적 파일
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── Button.jsx     # 버튼 컴포넌트
│   │   ├── Card.jsx       # 카드 컴포넌트
│   │   ├── Header.jsx     # 헤더 컴포넌트
│   │   ├── ChatBar.jsx    # 채팅 바
│   │   └── ...            # 기타 컴포넌트들
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── LoginPage.jsx  # 로그인 페이지
│   │   ├── MainPage.jsx   # 메인 대시보드
│   │   ├── AchievementsPage.jsx  # 업적 페이지
│   │   └── AboutUsPage.jsx # 개발자 소개 페이지
│   ├── stores/            # 상태 관리
│   │   ├── mainStore.js   # 메인 상태 관리
│   │   └── achievementsStore.js  # 업적 상태 관리
│   ├── styles/            # CSS 스타일
│   │   ├── components/    # 컴포넌트별 스타일
│   │   └── pages/         # 페이지별 스타일
│   ├── external/          # 외부 컴포넌트
│   │   └── Hyperspeed.jsx # 3D 배경 효과
│   └── main.jsx           # 애플리케이션 진입점
├── package.json           # 프로젝트 설정 및 의존성
└── README.md              # 프로젝트 문서
```

## 🎯 주요 기능 상세

### 🔐 인증 시스템
- 회사 이메일 도메인 기반 인증
- 2단계 인증 (이메일 코드)
- 로그인 시도 제한 및 계정 잠금
- 세션 관리 및 자동 로그아웃

### 💼 거래 시스템
- **판매 등록**: 포인트 수량, 가격, 유효기간 설정
- **구매 등록**: 필요 포인트, 최대 가격, 긴급도 설정
- **거래 매칭**: 자동 매칭 알고리즘
- **거래 내역**: 완료된 거래 기록 관리

### 🏆 업적 시스템
- **레벨 시스템**: 거래 활동 기반 경험치 획득
- **배지 시스템**: 다양한 업적 달성 시 배지 획득
- **퀘스트**: 특정 목표 달성 시 보상 제공
- **진행률 추적**: 업적 달성 현황 모니터링

### 💬 채팅 시스템
- **실시간 채팅**: 거래자 간 소통
- **온라인 사용자**: 현재 접속 중인 사용자 표시
- **채팅 기록**: 대화 내용 저장 및 관리
- **알림 시스템**: 새 메시지 도착 시 알림

## 🎨 UI/UX 특징

### 사이버펑크 테마
- 네온 색상 (파란색, 핑크, 보라색)
- 글로우 효과 및 그림자
- 다크 테마 기반 디자인
- 반응형 레이아웃

### 애니메이션
- 페이지 로딩 애니메이션
- 호버 효과 및 전환
- 3D 배경 효과 (Three.js)
- 부드러운 스크롤 및 이동

## 🔧 개발 가이드

### Git 커밋 메시지 규칙

프로젝트의 일관성과 가독성을 위해 다음과 같은 커밋 메시지 규칙을 따릅니다.

#### 📝 커밋 메시지 형식
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 🏷️ Type (필수)
- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정 (README, 주석 등)
- **style**: 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음)
- **refactor**: 코드 리팩토링 (기능 변경 없음)
- **test**: 테스트 코드 추가 또는 수정
- **chore**: 빌드 프로세스 또는 보조 도구 변경 (기능 변경 없음)
- **perf**: 성능 개선
- **ci**: CI/CD 설정 변경
- **build**: 빌드 시스템 또는 외부 종속성 변경

#### 🎯 Scope (선택)
- **auth**: 인증 관련
- **ui**: 사용자 인터페이스
- **api**: API 관련
- **db**: 데이터베이스 관련
- **test**: 테스트 관련
- **deps**: 의존성 관련

#### ✨ 예시
```bash
# 새로운 기능 추가
git commit -m "feat(auth): 로그인 시 2단계 인증 추가"

# 버그 수정
git commit -m "fix(ui): 모바일에서 버튼 클릭 영역 수정"

# 문서 수정
git commit -m "docs: README에 설치 가이드 추가"

# 코드 리팩토링
git commit -m "refactor(api): 사용자 정보 조회 함수 최적화"

# 테스트 추가
git commit -m "test: 로그인 컴포넌트 단위 테스트 추가"
```

#### 📋 커밋 메시지 작성 팁
- **제목은 50자 이내**로 작성
- **제목 첫 글자는 소문자**로 시작
- **제목 끝에 마침표 사용 금지**
- **명령형 어조** 사용 (Add, Fix, Update 등)
- **한국어 사용 권장** (프로젝트 특성상)

### 컴포넌트 개발
- 재사용 가능한 컴포넌트 설계
- Props 기반 데이터 전달
- CSS 모듈화 및 스타일 관리
- 반응형 디자인 적용

### 상태 관리
- Zustand를 활용한 전역 상태 관리
- 로컬 상태와 전역 상태 분리
- 상태 변경 시 성능 최적화
- 디버깅을 위한 로깅

### 라우팅
- React Router를 활용한 SPA 구현
- 보호된 라우트 및 인증 체크
- 페이지 간 데이터 전달
- 404 에러 처리

## 🚀 배포

### Frontend 배포
```bash
npm run build
# dist 폴더를 웹 서버에 업로드
```

### Backend 배포
```bash
# AWS EC2 또는 Lambda에 배포
# Docker 컨테이너 활용
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발팀

### Frontend Developer - 강현빈
- **담당 영역**: 기획, 디자인, 프론트엔드 개발 , QA
- **주요 기술**: React, Zustand, CSS3, UI/UX, jest
- **GitHub**: [@Crush-on-Study](https://github.com/Crush-on-Study)
- **Portfolio**: [포트폴리오](https://myresume-3d74d.web.app)

### Backend Developer - 성민제
- **담당 영역**: 백엔드 개발, 인프라 관리
- **주요 기술**: Python, FastAPI, PostgreSQL, AWS
- **GitHub**: [@mjcode1588](https://github.com/mjcode1588)

## 📚 오픈소스 출처

이 프로젝트는 다음과 같은 오픈소스 프로젝트들의 도움을 받아 개발되었습니다.

### React-bits
- **설명**: React 개발에 유용한 패턴과 모범 사례
- **GitHub**: [react-bits](https://github.com/DavidHDev/react-bits)
- **공식 사이트**: [reactbits.dev](https://reactbits.dev)
- **라이선스**: MIT License

### 주요 라이브러리
- **React**: [reactjs.org](https://reactjs.org/)
- **Vite**: [vitejs.dev](https://vitejs.dev/)
- **Zustand**: [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)

## 📞 문의 및 피드백

프로젝트에 대한 문의사항이나 개선 제안이 있으시면 언제든지 연락해주세요.

- **이메일**: twonkang00@naver.com
- **프로젝트 이슈**: [GitHub Issues](https://github.com/your-username/black-market/issues)

---

<div align="center">

**Black Market**으로 회사 내부 포인트 거래를 더욱 효율적으로! 🚀

Made with Action by 강현빈 & 성민제

</div>
