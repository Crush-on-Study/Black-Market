import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';

function App() {
  return (
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
  );
}

export default App;
