import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const MainPage = lazy(() => import('../pages/MainPage'));
const AchievementsPage = lazy(() => import('../pages/AchievementsPage'));
const SecurityPage = lazy(() => import('../pages/SecurityPage'));

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
    path: ROUTES.LOGIN,
    element: <LoginPage />
  },
  {
    path: ROUTES.MAIN,
    element: <MainPage />
  },
  {
    path: ROUTES.ACHIEVEMENTS,
    element: <AchievementsPage />
  },
  {
    path: ROUTES.SECURITY,
    element: <SecurityPage />
  }
]);

// 라우트 가드 (필요시 사용)
export const routeGuards = {
  requireAuth: (to, from) => {
    // 인증이 필요한 페이지에 대한 가드 로직
    return true;
  }
};
