import { render, screen, fireEvent } from '@testing-library/react';
import PopularDeals from '../PopularDeals';
import { useMainStore } from '../../stores/mainStore';

// Zustand store 모킹
jest.mock('../../stores/mainStore');

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
    company: '고려해운'
  },
  {
    id: 2,
    title: '프리미엄 식권 포인트 30만점',
    seller: '익명거래자2',
    points: 300000,
    price: 285000,
    status: 'selling',
    type: 'buy',
    views: 89,
    sellerRating: 4.9,
    sellerDeals: 45,
    company: '고려해운'
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
    company: '고려해운'
  }
];

describe('PopularDeals Component', () => {
  const mockOnSellerClick = jest.fn();
  const mockOnTradeRequest = jest.fn();

  beforeEach(() => {
    useMainStore.mockReturnValue({
      deals: mockDeals
    });
    jest.clearAllMocks();
  });

  test('renders popular deals section', () => {
    render(
      <PopularDeals 
        isPageLoaded={true}
        onSellerClick={mockOnSellerClick}
        onTradeRequest={mockOnTradeRequest}
      />
    );
    
    expect(screen.getByText('인기글 TOP 3')).toBeInTheDocument();
  });

  test('renders top 3 deals by views', () => {
    render(
      <PopularDeals 
        isPageLoaded={true}
        onSellerClick={mockOnSellerClick}
        onTradeRequest={mockOnTradeRequest}
      />
    );
    
    // 조회수 순으로 정렬된 상위 3개 거래
    expect(screen.getByText('특가 식권 포인트 100만점')).toBeInTheDocument(); // 203회
    expect(screen.getByText('고급 식권 포인트 50만점')).toBeInTheDocument(); // 127회
    expect(screen.getByText('프리미엄 식권 포인트 30만점')).toBeInTheDocument(); // 89회
  });

  test('displays deal type badges correctly', () => {
    render(
      <PopularDeals 
        isPageLoaded={true}
        onSellerClick={mockOnSellerClick}
        onTradeRequest={mockOnTradeRequest}
      />
    );
    
    const sellBadges = screen.getAllByText('🔴 판매');
    const buyBadges = screen.getAllByText('🟢 구매');
    
    expect(sellBadges).toHaveLength(2);
    expect(buyBadges).toHaveLength(1);
  });

  test('shows deal information correctly', () => {
    render(
      <PopularDeals 
        isPageLoaded={true}
        onSellerClick={mockOnSellerClick}
        onTradeRequest={mockOnTradeRequest}
      />
    );
    
    expect(screen.getByText('조회수:')).toBeInTheDocument();
    expect(screen.getByText('203회')).toBeInTheDocument();
    expect(screen.getByText('가격:')).toBeInTheDocument();
    expect(screen.getByText('900,000원')).toBeInTheDocument();
    expect(screen.getByText('판매자:')).toBeInTheDocument();
    expect(screen.getByText('익명거래자3')).toBeInTheDocument();
  });

  test('handles seller click', () => {
    render(
      <PopularDeals 
        isPageLoaded={true}
        onSellerClick={mockOnSellerClick}
        onTradeRequest={mockOnTradeRequest}
      />
    );
    
    const sellerButton = screen.getByText('익명거래자3');
    fireEvent.click(sellerButton);
    
    expect(mockOnSellerClick).toHaveBeenCalledWith(mockDeals[2], expect.any(Object));
  });

  test('handles trade request click', () => {
    render(
      <PopularDeals 
        isPageLoaded={true}
        onSellerClick={mockOnSellerClick}
        onTradeRequest={mockOnTradeRequest}
      />
    );
    
    const tradeButtons = screen.getAllByText('거래 신청');
    fireEvent.click(tradeButtons[0]); // 첫 번째 버튼 클릭
    
    expect(mockOnTradeRequest).toHaveBeenCalledWith(mockDeals[0], expect.any(Object));
  });

  test('applies animation classes when page is loaded', () => {
    render(
      <PopularDeals 
        isPageLoaded={true}
        onSellerClick={mockOnSellerClick}
        onTradeRequest={mockOnTradeRequest}
      />
    );
    
    const dealCards = screen.getAllByText(/식권 포인트/);
    dealCards.forEach((card, index) => {
      expect(card.closest('.popular-deal-card')).toHaveClass('animate-in');
    });
  });

  test('does not apply animation classes when page is not loaded', () => {
    render(
      <PopularDeals 
        isPageLoaded={false}
        onSellerClick={mockOnSellerClick}
        onTradeRequest={mockOnTradeRequest}
      />
    );
    
    const dealCards = screen.getAllByText(/식권 포인트/);
    dealCards.forEach((card) => {
      expect(card.closest('.popular-deal-card')).not.toHaveClass('animate-in');
    });
  });

  test('truncates long titles', () => {
    const longTitleDeal = {
      ...mockDeals[0],
      title: '매우 긴 제목을 가진 식권 포인트 거래입니다. 이 제목은 20자를 넘어갑니다.'
    };
    
    useMainStore.mockReturnValue({
      deals: [longTitleDeal]
    });
    
    render(
      <PopularDeals 
        isPageLoaded={true}
        onSellerClick={mockOnSellerClick}
        onTradeRequest={mockOnTradeRequest}
      />
    );
    
    expect(screen.getByText('매우 긴 제목을 가진 식권 포인트 거래입니다. 이 제목은 20자를 넘어갑니다...')).toBeInTheDocument();
  });

  test('displays rank badges correctly', () => {
    render(
      <PopularDeals 
        isPageLoaded={true}
        onSellerClick={mockOnSellerClick}
        onTradeRequest={mockOnTradeRequest}
      />
    );
    
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('#3')).toBeInTheDocument();
  });
});
