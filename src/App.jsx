import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="App">
          <Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              background: '#000000',
              color: '#00d4ff',
              fontSize: '18px'
            }}>
              <div>⚡ Black Market 로딩 중...</div>
            </div>
          }>
            <RouterProvider router={router} />
          </Suspense>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
