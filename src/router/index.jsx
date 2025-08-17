import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// 페이지 컴포넌트들을 lazy loading으로 import
const LoginPage = lazy(() => import('../pages/LoginPage'));
const MainPage = lazy(() => import('../pages/MainPage'));
const AchievementsPage = lazy(() => import('../pages/AchievementsPage'));
const SecurityPage = lazy(() => import('../pages/SecurityPage'));
const AboutUsPage = lazy(() => import('../pages/AboutUsPage'));

// 라우트 정의
export const ROUTES = {
  LOGIN: '/login',
  MAIN: '/main',
  ACHIEVEMENTS: '/achievements',
  SECURITY: '/security'
};

// 라우터 생성
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/main',
    element: <MainPage />
  },
  {
    path: '/achievements',
    element: <AchievementsPage />
  },
  {
    path: '/security',
    element: <SecurityPage />
  },
  {
    path: '/about',
    element: <AboutUsPage />
  }
]);

// 라우트 가드 (필요시 사용)
export const routeGuards = {
  requireAuth: (to, from) => {
    // 인증이 필요한 페이지에 대한 가드 로직
    return true;
  }
};
