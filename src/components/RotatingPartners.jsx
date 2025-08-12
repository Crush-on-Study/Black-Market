import { useEffect, useRef } from 'react';
import '../styles/components/RotatingPartners.css';

function RotatingPartners() {
  const containerRef = useRef(null);

  // 제휴 회사 목록
  const partners = [
    { name: '고려해운', icon: '🚢', category: '해운' },
    { name: '테스콤', icon: '🔌', category: '전자' },
    { name: '삼성카드', icon: '💳', category: '금융' },
    { name: 'Google', icon: '🔍', category: '기술' },
    { name: 'eBay', icon: '🛒', category: '커머스' },
    { name: 'Microsoft', icon: '🪟', category: '소프트웨어' },
    { name: 'Netflix', icon: '📺', category: '엔터테인먼트' },
    { name: 'Meta', icon: '📱', category: '소셜' },
    { name: 'SAP Labs', icon: '🏢', category: '엔터프라이즈' },
    { name: 'Oracle', icon: '🗄️', category: '데이터베이스' }
  ];

  // 무한 스크롤을 위해 회사 목록을 2번 반복
  const duplicatedPartners = [...partners, ...partners];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 스크롤 애니메이션
    const scrollAnimation = () => {
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    };

    // 애니메이션 속도 조절 (값이 클수록 빠름)
    const animationSpeed = 1;
    const interval = setInterval(scrollAnimation, 50 / animationSpeed);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rotating-partners">
      <div className="partners-header">
        <h3>⚡ 제휴 파트너사 ⚡</h3>
        <p>Black Market과 함께하는 글로벌 기업들</p>
      </div>
      
      <div className="partners-container" ref={containerRef}>
        <div className="partners-track">
          {duplicatedPartners.map((partner, index) => (
            <div key={`${partner.name}-${index}`} className="partner-item">
              <div className="partner-icon">{partner.icon}</div>
              <div className="partner-info">
                <div className="partner-name">{partner.name}</div>
                <div className="partner-category">{partner.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RotatingPartners;
