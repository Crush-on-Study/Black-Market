import { useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Button from '../components/Button';
import Card from '../components/Card';
import Header from '../components/Header';
import DropdownSelect from '../components/DropdownSelect';
import { useMainStore } from '../stores/mainStore';
import '../styles/pages/MainPage.css';

// Lazy loading for heavy modals
const SellModal = lazy(() => import('../components/SellModal'));
const BuyModal = lazy(() => import('../components/BuyModal'));
const Pagination = lazy(() => import('../components/Pagination'));
const MessageModal = lazy(() => import('../components/MessageModal'));

function MainPage() {
  // Zustand store에서 상태와 액션 가져오기
  const {
    // 상태들
    deals,
    isLoading,
    userAvatar,
    userNickname,
    isSellModalOpen,
    isBuyModalOpen,
    isSellerModalOpen,
    isMessageModalOpen,
    selectedSeller,
    selectedDeal,
    statusFilter,
    typeFilter,
    searchTerm,
    currentPage,
    itemsPerPage,
    isPageLoaded,
    statusOptions,
    typeOptions,
    itemsPerPageOptions,
    
    // 액션들
    setDeals,
    setIsLoading,
    setUserAvatar,
    setUserNickname,
    openSellModal,
    closeSellModal,
    openBuyModal,
    closeBuyModal,
    openSellerModal,
    closeSellerModal,
    openMessageModal,
    closeMessageModal,
    setStatusFilter,
    setTypeFilter,
    setSearchTerm,
    setCurrentPage,
    setItemsPerPage,
    setIsPageLoaded,
    
    // 계산된 값들
    getFilteredDeals,
    getPaginationInfo
  } = useMainStore();


  const navigate = useNavigate();
  const location = useLocation();
  
  // 로그인 시 전달받은 사용자 정보
  const { companyName = 'Black Market', domain = '', userEmail = '', nickname = '' } = location.state || {};

  // 구매등록 브레드크럼 단계
  const purchaseSteps = [
    { id: 1, title: '거래 정보', description: '거래할 포인트 정보를 입력하세요' },
    { id: 2, title: '가격 설정', description: '판매 가격을 설정하세요' },
    { id: 3, title: '확인 및 등록', description: '정보를 확인하고 등록하세요' }
  ];

  // 7일 후 날짜 계산 함수
  const getExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  // Zustand store에서 계산된 값들 가져오기
  const filteredDeals = getFilteredDeals();
  const { totalPages, currentDeals, totalItems } = getPaginationInfo();

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusFilterChange = (option) => {
    setStatusFilter(option.value);
  };

  const handleTypeFilterChange = (option) => {
    setTypeFilter(option.value);
  };

  const handleItemsPerPageChange = (option) => {
    setItemsPerPage(option.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };



  // 10만 포인트 기준 현금 거래 데이터 (24시간)
  const getPointPriceData = () => {
    return [
      { time: '00:00', price: 95000, volume: 1250000, change: -0.5 },
      { time: '01:00', price: 94800, volume: 980000, change: -0.2 },
      { time: '02:00', price: 94500, volume: 750000, change: -0.3 },
      { time: '03:00', price: 94200, volume: 650000, change: -0.3 },
      { time: '04:00', price: 94000, volume: 580000, change: -0.2 },
      { time: '05:00', price: 93800, volume: 720000, change: -0.2 },
      { time: '06:00', price: 94500, volume: 890000, change: 0.7 },
      { time: '07:00', price: 95200, volume: 1150000, change: 0.7 },
      { time: '08:00', price: 96000, volume: 1380000, change: 0.8 },
      { time: '09:00', price: 96800, volume: 1520000, change: 0.8 },
      { time: '10:00', price: 97500, volume: 1680000, change: 0.7 },
      { time: '11:00', price: 98200, volume: 1750000, change: 0.7 },
      { time: '12:00', price: 99000, volume: 1820000, change: 0.8 },
      { time: '13:00', price: 99500, volume: 1780000, change: 0.5 },
      { time: '14:00', price: 100000, volume: 1720000, change: 0.5 },
      { time: '15:00', price: 100500, volume: 1680000, change: 0.5 },
      { time: '16:00', price: 101000, volume: 1650000, change: 0.5 },
      { time: '17:00', price: 101500, volume: 1580000, change: 0.5 },
      { time: '18:00', price: 102000, volume: 1520000, change: 0.5 },
      { time: '19:00', price: 101500, volume: 1480000, change: -0.5 },
      { time: '20:00', price: 101000, volume: 1420000, change: -0.5 },
      { time: '21:00', price: 100500, volume: 1380000, change: -0.5 },
      { time: '22:00', price: 100000, volume: 1350000, change: -0.5 },
      { time: '23:00', price: 99500, volume: 1280000, change: -0.5 },
      { time: '24:00', price: 99000, volume: 1250000, change: -0.5 }
    ];
  };

  useEffect(() => {
    // 로그인 정보가 없으면 로그인 페이지로 리다이렉트
    if (!location.state) {
      navigate('/login');
      return;
    }

    // 닉네임 설정
    if (nickname) {
      setUserNickname(nickname);
    }

    // 거래 데이터 로딩 시뮬레이션
    const loadDeals = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock 데이터 - 회사별로 필터링, 7일 후 만료
        const mockDeals = [
          {
            id: 1,
            title: '고급 식권 포인트 50만점',
            seller: '익명거래자1',
            points: 500000,
            price: 450000,
            status: 'selling',
            type: 'sell',
            views: 127,
            sellerRating: 4.8,
            sellerDeals: 23,
            company: companyName,
            expiresAt: getExpiryDate()
          },
          {
            id: 2,
            title: '프리미엄 식권 포인트 30만점',
            seller: '익명거래자2',
            points: 300000,
            price: 285000,
            status: 'completed',
            type: 'sell',
            views: 89,
            sellerRating: 4.9,
            sellerDeals: 45,
            company: companyName,
            expiresAt: getExpiryDate()
          },
          {
            id: 3,
            title: '특가 식권 포인트 100만점',
            seller: '익명거래자3',
            points: 1000000,
            price: 900000,
            status: 'selling',
            type: 'sell',
            views: 203,
            sellerRating: 4.7,
            sellerDeals: 67,
            company: companyName,
            expiresAt: getExpiryDate()
          },
          {
            id: 4,
            title: '식권 포인트 80만점 구매 희망',
            seller: '구매희망자1',
            points: 800000,
            price: 720000,
            status: 'selling',
            type: 'buy',
            views: 156,
            sellerRating: 4.6,
            sellerDeals: 34,
            company: companyName,
            expiresAt: getExpiryDate()
          },
          {
            id: 5,
            title: '식권 포인트 200만점 대량 구매',
            seller: '대량구매자1',
            points: 2000000,
            price: 1800000,
            status: 'selling',
            type: 'buy',
            views: 98,
            sellerRating: 4.9,
            sellerDeals: 89,
            company: companyName,
            expiresAt: getExpiryDate()
          },
          {
            id: 6,
            title: '식권 포인트 150만점 할인 판매',
            seller: '익명거래자4',
            points: 1500000,
            price: 1350000,
            status: 'selling',
            type: 'sell',
            views: 167,
            sellerRating: 4.6,
            sellerDeals: 32,
            company: companyName,
            expiresAt: getExpiryDate()
          },
          {
            id: 7,
            title: '식권 포인트 400만점 구매 희망',
            seller: '구매희망자2',
            points: 4000000,
            price: 3600000,
            status: 'selling',
            type: 'buy',
            views: 134,
            sellerRating: 4.8,
            sellerDeals: 56,
            company: companyName,
            expiresAt: getExpiryDate()
          },
          {
            id: 8,
            title: '식권 포인트 75만점 특가',
            seller: '익명거래자5',
            points: 750000,
            price: 675000,
            status: 'completed',
            type: 'sell',
            views: 92,
            sellerRating: 4.4,
            sellerDeals: 18,
            company: companyName,
            expiresAt: getExpiryDate()
          },
          {
            id: 9,
            title: '식권 포인트 120만점 구매',
            seller: '구매희망자3',
            points: 1200000,
            price: 1080000,
            status: 'selling',
            type: 'buy',
            views: 145,
            sellerRating: 4.7,
            sellerDeals: 41,
            company: companyName,
            expiresAt: getExpiryDate()
          },
          {
            id: 10,
            title: '식권 포인트 90만점 판매',
            seller: '익명거래자6',
            points: 900000,
            price: 810000,
            status: 'selling',
            type: 'sell',
            views: 178,
            sellerRating: 4.9,
            sellerDeals: 67,
            company: companyName,
            expiresAt: getExpiryDate()
          },
          {
            id: 11,
            title: '식권 포인트 250만점 대량 구매',
            seller: '대량구매자2',
            points: 2500000,
            price: 2250000,
            status: 'selling',
            type: 'buy',
            views: 89,
            sellerRating: 4.5,
            sellerDeals: 23,
            company: companyName,
            expiresAt: getExpiryDate()
          },
          {
            id: 12,
            title: '식권 포인트 180만점 할인',
            seller: '익명거래자7',
            points: 1800000,
            price: 1620000,
            status: 'completed',
            type: 'sell',
            views: 156,
            sellerRating: 4.3,
            sellerDeals: 29,
            company: companyName,
            expiresAt: getExpiryDate()
          }
        ];
        
        setDeals(mockDeals);
        setIsLoading(false);
        
        // 페이지 로드 완료 후 애니메이션 시작
        setTimeout(() => {
          setIsPageLoaded(true);
        }, 200);
      } catch (error) {
        console.error('거래 데이터 로딩 실패:', error);
        setIsLoading(false);
      }
    };

    loadDeals();
  }, [navigate, location.state, companyName, nickname]);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleDealClick = (dealId) => {
    // 거래 상세 페이지로 이동 (향후 구현)
    console.log('거래 선택:', dealId);
  };



  const handleSellRegister = () => {
    openSellModal();
  };

  const handleBuyRegister = () => {
    openBuyModal();
  };

  const handleSellerClick = (seller, e) => {
    e.stopPropagation(); // 거래 카드 클릭 이벤트 방지
    openSellerModal(seller);
  };

  const handleTradeRequest = (deal, e) => {
    e.stopPropagation();
    openMessageModal(deal);
  };

  if (isLoading) {
    return (
      <div className="main-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>거래 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const pointPriceData = getPointPriceData();
  const priceChange = -1.0; // 24시간 변동률 (고정값)

  return (
    <div className={`main-container ${isPageLoaded ? 'loaded' : ''}`}>
      {/* 헤더 */}
      <Header
        companyName={companyName}
        userNickname={userNickname || '사용자'}
        userEmail={userEmail}
        userAvatar={userAvatar}
        onAvatarChange={setUserAvatar}
        onSellRegister={handleSellRegister}
        onBuyRegister={handleBuyRegister}
      />

      {/* 메인 콘텐츠 */}
      <main className="main-content">

        {/* Bento 레이아웃 */}
        <div className="bento-layout">
          {/* 왼쪽 섹션 - 거래 목록 */}
                      <div className={`bento-left ${isPageLoaded ? 'animate-in' : ''}`}>
              <div className="deals-section">
              
              {/* 인기글 TOP 3 */}
              <div className="popular-deals">
                <div className="popular-deals-grid">
                  {deals
                    .filter(deal => deal.status === 'selling')
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map((deal, index) => (
                      <Card 
                        key={`popular-${deal.id}`} 
                        variant="elevated" 
                        className={`popular-deal-card ${isPageLoaded ? 'animate-in' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="popular-deal-header">
                          <span className="rank-badge">#{index + 1}</span>
                          <div className="deal-type-badge">
                            {deal.type === 'buy' ? '🟢 구매' : '🔴 판매'}
                          </div>
                          <h5 className="deal-title-truncate" title={deal.title}>
                            {deal.title.length > 20 ? `${deal.title.substring(0, 20)}...` : deal.title}
                          </h5>
                        </div>
                        <div className="popular-deal-info">
                          <p><strong>조회수:</strong> {deal.views.toLocaleString()}회</p>
                          <p><strong>가격:</strong> {deal.price.toLocaleString()}원</p>
                          <p><strong>{deal.type === 'buy' ? '구매자' : '판매자'}:</strong> 
                            <button 
                              className="seller-button-mini"
                              onClick={(e) => handleSellerClick(deal, e)}
                              title={`${deal.seller} 정보 보기`}
                            >
                              {deal.seller}
                            </button>
                          </p>
                        </div>
                        <div className="popular-deal-actions">
                          <Button 
                            variant="primary" 
                            size="small" 
                            fullWidth
                            onClick={(e) => handleTradeRequest(deal, e)}
                          >
                            거래 신청
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* 게시판 */}
              <div className="deals-board">
                <div className="board-header">
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="제목 또는 작성자로 검색..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="search-input"
                    />
                  </div>
                  <div className="board-filters">
                    <DropdownSelect
                      options={typeOptions}
                      value={typeFilter}
                      onChange={handleTypeFilterChange}
                      placeholder="전체 유형"
                      className="type-filter"
                    />
                    <DropdownSelect
                      options={statusOptions}
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      placeholder="전체 상태"
                      className="status-filter"
                    />
                    <DropdownSelect
                      options={itemsPerPageOptions}
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      placeholder="10개씩"
                      className="items-per-page-filter"
                    />
                  </div>
                </div>
                
                <div className="board-table">
                  <div className="table-header">
                    <div className="table-cell">구분</div>
                    <div className="table-cell">제목</div>
                    <div className="table-cell">작성자</div>
                    <div className="table-cell">포인트</div>
                    <div className="table-cell">가격</div>
                    <div className="table-cell">조회수</div>
                    <div className="table-cell">상태</div>
                    <div className="table-cell">작업</div>
                  </div>
                  
                  {currentDeals.map((deal, index) => (
                    <div 
                      key={deal.id} 
                      className={`table-row ${isPageLoaded ? 'animate-in' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="table-cell">
                        <span className={`deal-type ${deal.type}`}>
                          {deal.type === 'buy' ? '🟢 구매' : '🔴 판매'}
                        </span>
                      </div>
                      <div className="table-cell title-cell">
                        <span className="deal-title">{deal.title}</span>
                      </div>
                      <div className="table-cell">
                        <button 
                          className="seller-button"
                          onClick={(e) => handleSellerClick(deal, e)}
                        >
                          {deal.seller}
                        </button>
                      </div>
                      <div className="table-cell">{deal.points.toLocaleString()}점</div>
                      <div className="table-cell">{deal.price.toLocaleString()}원</div>
                      <div className="table-cell">{deal.views.toLocaleString()}회</div>
                      <div className="table-cell">
                        <span className={`deal-status ${deal.status}`}>
                          {deal.status === 'selling' ? '🟢 거래 중' : '🔴 거래 완료'}
                        </span>
                      </div>
                      <div className="table-cell">
                        <Button 
                          variant={deal.status === 'selling' ? 'primary' : 'secondary'}
                          size="small"
                          disabled={deal.status === 'completed'}
                          className={deal.status === 'completed' ? 'deal-completed' : ''}
                          onClick={deal.status === 'selling' ? (e) => handleTradeRequest(deal, e) : undefined}
                        >
                          {deal.status === 'selling' ? '거래 신청' : '거래 완료'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 페이지네이션 */}
                <Suspense fallback={<div>페이지네이션 로딩 중...</div>}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredDeals.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </Suspense>
              </div>
            </div>
          </div>

          {/* 오른쪽 섹션 */}
          <div className="bento-right">
            {/* 오른쪽 위 - 포인트 가격 차트 */}
            <div className={`bento-top ${isPageLoaded ? 'animate-in' : ''}`}>
              <Card variant="elevated" className="point-price-chart">
                <div className="chart-header">
                  <h3>📈 10만 포인트 기준 현금 거래</h3>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={getPointPriceData()} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(0, 212, 255, 0.8)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="rgba(0, 212, 255, 0.1)" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis 
                        dataKey="time" 
                        stroke="rgba(255, 255, 255, 0.6)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="rgba(255, 255, 255, 0.6)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(26, 26, 26, 0.95)',
                          border: '1px solid rgba(0, 212, 255, 0.4)',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                        labelStyle={{ color: 'rgba(0, 212, 255, 0.8)' }}
                        formatter={(value, name) => [
                          name === 'price' ? `₩${value.toLocaleString()}` : value,
                          name === 'price' ? '가격' : name === 'volume' ? '거래량' : '변동률'
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="rgba(0, 212, 255, 0.8)"
                        strokeWidth={2}
                        fill="url(#priceGradient)"
                        dot={{
                          fill: 'rgba(0, 212, 255, 0.8)',
                          strokeWidth: 2,
                          r: 3
                        }}
                        activeDot={{
                          r: 6,
                          stroke: 'rgba(0, 212, 255, 0.8)',
                          strokeWidth: 2,
                          fill: '#ffffff'
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-stats">
                  <div className="stat-item">
                    <span className="stat-label">24시간 변동</span>
                    <span className={`stat-value ${priceChange >= 0 ? 'positive' : 'negative'}`}>
                      {priceChange >= 0 ? '+' : ''}{priceChange}%
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">현재가</span>
                    <span className="stat-value">₩{pointPriceData[Math.floor(pointPriceData.length / 2)].price.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">고가</span>
                    <span className="stat-value">₩{Math.max(...getPointPriceData().map(item => item.price)).toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">저가</span>
                    <span className="stat-value">₩{Math.min(...getPointPriceData().map(item => item.price)).toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* 오른쪽 아래 - 요약 카드들 */}
            <div className={`bento-bottom ${isPageLoaded ? 'animate-in' : ''}`}>
              <div className="summary-cards">
                <Card variant="elevated" className="summary-card total-deals">
                  <div className="summary-icon">📊</div>
                  <div className="summary-content">
                    <h3>총 거래 건수</h3>
                    <div className="summary-number">{deals.length}</div>
                    <div className="summary-change positive">+12.5%</div>
                  </div>
                </Card>

                <Card variant="elevated" className="summary-card total-volume">
                  <div className="summary-icon">💰</div>
                  <div className="summary-content">
                    <h3>거래량</h3>
                    <div className="summary-number">₩{deals.reduce((sum, deal) => sum + deal.price, 0).toLocaleString()}</div>
                    <div className="summary-change positive">+8.3%</div>
                  </div>
                </Card>

                <Card variant="elevated" className="summary-card active-users">
                  <div className="summary-icon">👥</div>
                  <div className="summary-content">
                    <h3>활성 사용자</h3>
                    <div className="summary-number">1,247</div>
                    <div className="summary-change positive">+5.7%</div>
                  </div>
                </Card>

                <Card variant="elevated" className="summary-card market-cap">
                  <div className="summary-icon">📈</div>
                  <div className="summary-content">
                    <h3>시장 가치</h3>
                    <div className="summary-number">₩2.4B</div>
                    <div className="summary-change negative">-2.1%</div>
                  </div>
                </Card>
              </div>

              {/* 최근 거래 내역 */}
              <Card variant="elevated" className="recent-trades-card">
                <div className="card-header">
                  <h3>🔄 최근 거래 내역</h3>
                  <Button variant="secondary" size="small">전체보기</Button>
                </div>
                <div className="recent-trades">
                  {[
                    { id: 1, type: 'buy', user: '익명거래자1', points: '50만', price: '₩450K', time: '2분 전' },
                    { id: 2, type: 'sell', user: '익명거래자2', points: '30만', price: '₩285K', time: '5분 전' },
                    { id: 3, type: 'buy', user: '익명거래자3', points: '100만', price: '₩900K', time: '8분 전' },
                    { id: 4, type: 'sell', user: '익명거래자4', points: '25만', price: '₩240K', time: '12분 전' },
                    { id: 5, type: 'buy', user: '익명거래자5', points: '75만', price: '₩675K', time: '15분 전' }
                  ].map((trade) => (
                    <div key={trade.id} className={`trade-item ${trade.type}`}>
                      <div className="trade-type">
                        <span className={`trade-icon ${trade.type}`}>
                          {trade.type === 'buy' ? '📥' : '📤'}
                        </span>
                        <span className="trade-user">{trade.user}</span>
                      </div>
                      <div className="trade-details">
                        <span className="trade-points">{trade.points}</span>
                        <span className="trade-price">{trade.price}</span>
                      </div>
                      <div className="trade-time">{trade.time}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>



      {/* 판매등록 모달 */}
      <Suspense fallback={<div>모달 로딩 중...</div>}>
        <SellModal
          isOpen={isSellModalOpen}
          onClose={closeSellModal}
        />
      </Suspense>

      {/* 구매등록 모달 */}
      <Suspense fallback={<div>모달 로딩 중...</div>}>
        <BuyModal
          isOpen={isBuyModalOpen}
          onClose={closeBuyModal}
        />
      </Suspense>

      {/* 쪽지 모달 */}
      <Suspense fallback={<div>모달 로딩 중...</div>}>
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={closeMessageModal}
          deal={selectedDeal}
          messageType="trade"
        />
      </Suspense>

      {/* 판매자 정보 모달 */}
      {isSellerModalOpen && selectedSeller && (
        <div className="seller-modal-overlay" onClick={closeSellerModal}>
          <div className="seller-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👤 판매자 정보</h2>
              <button className="close-button" onClick={closeSellerModal}>✕</button>
            </div>
            
            <div className="seller-profile">
              <div className="seller-avatar">👤</div>
              <div className="seller-basic-info">
                <h3>{selectedSeller.seller}</h3>
                <div className="seller-rating">
                  <span className="stars">{'⭐'.repeat(Math.floor(selectedSeller.sellerRating))}</span>
                  <span className="rating-number">{selectedSeller.sellerRating}</span>
                </div>
              </div>
            </div>
            
            <div className="seller-stats">
              <div className="stat-item">
                <span className="stat-label">총 거래 건수</span>
                <span className="stat-value">{selectedSeller.sellerDeals}건</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">평균 평점</span>
                <span className="stat-value">{selectedSeller.sellerRating}/5.0</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">현재 판매글</span>
                <span className="stat-value">{deals.filter(d => d.seller === selectedSeller.seller && d.status === 'selling').length}건</span>
              </div>
            </div>
            
            <div className="seller-recent-deals">
              <h4>최근 거래 내역</h4>
              <div className="recent-deals-list">
                {deals
                  .filter(d => d.seller === selectedSeller.seller)
                  .slice(0, 3)
                  .map((deal) => (
                    <div key={deal.id} className="recent-deal-item">
                      <span className="deal-title">{deal.title}</span>
                      <span className="deal-status-mini">
                        {deal.status === 'selling' ? '🟢' : '🔴'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="modal-actions">
              <Button variant="secondary" size="medium" onClick={closeSellerModal}>
                닫기
              </Button>
              <Button variant="primary" size="medium">
                판매자와 채팅
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
