import { useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Header from '../components/Header';
import PopularDeals from '../components/PopularDeals';
import DealsBoard from '../components/DealsBoard';
import PointPriceChart from '../components/PointPriceChart';
import RecentTrades from '../components/RecentTrades';
import ChatBar from '../components/ChatBar';
import { useMainStore } from '../stores/mainStore';
import { mockDeals, getExpiryDate } from '../data/mockData';
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
    console.log('MainPage: Status filter changed to:', option);
    setStatusFilter(option.value);
  };

  const handleTypeFilterChange = (option) => {
    console.log('MainPage: Type filter changed to:', option);
    setTypeFilter(option.value);
  };

  const handleItemsPerPageChange = (option) => {
    console.log('MainPage: Items per page changed to:', option);
    setItemsPerPage(option.value);
  };

  const handleSearchChange = (e) => {
    console.log('MainPage: Search term changed to:', e.target.value);
    setSearchTerm(e.target.value);
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
        
        // Mock 데이터를 회사별로 필터링하여 사용
        const companyDeals = mockDeals.map(deal => ({
          ...deal,
          company: companyName,
          expiresAt: getExpiryDate()
        }));
        
        setDeals(companyDeals);
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

  // 업적 페이지에서 모달 열기 시그널 받기
  useEffect(() => {
    const handleOpenSellModal = () => {
      handleSellRegister();
    };
    
    const handleOpenBuyModal = () => {
      handleBuyRegister();
    };
    
    window.addEventListener('openSellModal', handleOpenSellModal);
    window.addEventListener('openBuyModal', handleOpenBuyModal);
    
    return () => {
      window.removeEventListener('openSellModal', handleOpenSellModal);
      window.removeEventListener('openBuyModal', handleOpenBuyModal);
    };
  }, []);
  
  // 페이지 로드 시 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
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



  return (
    <div className={`main-container ${isPageLoaded ? 'loaded' : ''}`}>
      {/* Header 컴포넌트 사용 */}
      <Header 
        companyName={location.state?.companyName || 'Black Market'}
        userNickname={location.state?.nickname || '사용자'}
        userEmail={location.state?.userEmail || ''}
        userAvatar={location.state?.userAvatar || '👤'}
        onAvatarChange={setUserAvatar}
        onSellRegister={handleSellRegister}
        onBuyRegister={handleBuyRegister}
        showBackButton={false}
      />

      {/* 메인 콘텐츠 */}
      <main className="main-content">

        {/* Bento 레이아웃 */}
        <div className="bento-layout">
          {/* 왼쪽 섹션 - 거래 목록 */}
                      <div className={`bento-left ${isPageLoaded ? 'animate-in' : ''}`}>
              <div className="deals-section">
              
              {/* 인기글 TOP 3 */}
              <PopularDeals
                isPageLoaded={isPageLoaded}
                onSellerClick={handleSellerClick}
                onTradeRequest={handleTradeRequest}
              />

              {/* 게시판 */}
              <DealsBoard
                // 데이터 props
                deals={deals}
                statusFilter={statusFilter}
                typeFilter={typeFilter}
                searchTerm={searchTerm}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                statusOptions={statusOptions}
                typeOptions={typeOptions}
                itemsPerPageOptions={itemsPerPageOptions}
                filteredDeals={currentDeals}
                totalPages={totalPages}
                totalItems={totalItems}
                
                // 이벤트 핸들러 props
                onSellerClick={handleSellerClick}
                onTradeRequest={handleTradeRequest}
                onStatusFilterChange={handleStatusFilterChange}
                onTypeFilterChange={handleTypeFilterChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                onSearchChange={handleSearchChange}
                onPageChange={handlePageChange}
                
                // UI 설정 props
                isPageLoaded={isPageLoaded}
                showFilters={true}
                showPagination={true}
                showSearch={true}
                maxItemsPerPage={50}
              />
            </div>
          </div>

          {/* 오른쪽 섹션 */}
          <div className="bento-right">
            {/* 오른쪽 위 - 포인트 가격 차트 */}
            <div className={`bento-top ${isPageLoaded ? 'animate-in' : ''}`}>
              <PointPriceChart />
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
              <RecentTrades />
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
      
      {/* 채팅 사이드바 */}
      <ChatBar userNickname={location.state?.nickname || '사용자'} />
    </div>
  );
}

export default MainPage;
