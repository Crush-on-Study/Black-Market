import { render, screen, fireEvent } from '@testing-library/react';
import RecentTrades from '../RecentTrades';

// mockData 모킹
jest.mock('../../data/mockData', () => ({
  recentTradesData: [
    { id: 1, type: 'buy', user: '익명거래자1', points: '50만', price: '₩450K', time: '2분 전' },
    { id: 2, type: 'sell', user: '익명거래자2', points: '30만', price: '₩285K', time: '5분 전' },
    { id: 3, type: 'buy', user: '익명거래자3', points: '100만', price: '₩900K', time: '8분 전' },
    { id: 4, type: 'sell', user: '익명거래자4', points: '25만', price: '₩240K', time: '12분 전' },
    { id: 5, type: 'buy', user: '익명거래자5', points: '75만', price: '₩675K', time: '15분 전' }
  ]
}));

describe('RecentTrades Component', () => {
  test('renders recent trades section', () => {
    render(<RecentTrades />);
    
    expect(screen.getByText('🔄 최근 거래 내역')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '전체보기' })).toBeInTheDocument();
  });

  test('renders all recent trades', () => {
    render(<RecentTrades />);
    
    expect(screen.getByText('익명거래자1')).toBeInTheDocument();
    expect(screen.getByText('익명거래자2')).toBeInTheDocument();
    expect(screen.getByText('익명거래자3')).toBeInTheDocument();
    expect(screen.getByText('익명거래자4')).toBeInTheDocument();
    expect(screen.getByText('익명거래자5')).toBeInTheDocument();
  });

  test('displays trade type icons correctly', () => {
    render(<RecentTrades />);
    
    // 구매 거래 아이콘
    const buyIcons = screen.getAllByText('📥');
    expect(buyIcons).toHaveLength(3); // 1, 3, 5번 거래
    
    // 판매 거래 아이콘
    const sellIcons = screen.getAllByText('📤');
    expect(sellIcons).toHaveLength(2); // 2, 4번 거래
  });

  test('shows trade details correctly', () => {
    render(<RecentTrades />);
    
    // 첫 번째 거래 상세 정보
    expect(screen.getByText('50만')).toBeInTheDocument();
    expect(screen.getByText('₩450K')).toBeInTheDocument();
    expect(screen.getByText('2분 전')).toBeInTheDocument();
  });

  test('applies correct CSS classes for trade types', () => {
    render(<RecentTrades />);
    
    // 구매 거래 클래스
    const buyTrades = screen.getAllByText('📥').map(icon => icon.closest('.trade-item'));
    buyTrades.forEach(trade => {
      expect(trade).toHaveClass('buy');
    });
    
    // 판매 거래 클래스
    const sellTrades = screen.getAllByText('📤').map(icon => icon.closest('.trade-item'));
    sellTrades.forEach(trade => {
      expect(trade).toHaveClass('sell');
    });
  });

  test('renders trade information in correct order', () => {
    render(<RecentTrades />);
    
    const tradeItems = screen.getAllByText(/익명거래자/);
    
    // 거래 순서 확인
    expect(tradeItems[0]).toHaveTextContent('익명거래자1');
    expect(tradeItems[1]).toHaveTextContent('익명거래자2');
    expect(tradeItems[2]).toHaveTextContent('익명거래자3');
    expect(tradeItems[3]).toHaveTextContent('익명거래자4');
    expect(tradeItems[4]).toHaveTextContent('익명거래자5');
  });

  test('displays points and price for each trade', () => {
    render(<RecentTrades />);
    
    // 포인트 정보
    expect(screen.getByText('50만')).toBeInTheDocument();
    expect(screen.getByText('30만')).toBeInTheDocument();
    expect(screen.getByText('100만')).toBeInTheDocument();
    expect(screen.getByText('25만')).toBeInTheDocument();
    expect(screen.getByText('75만')).toBeInTheDocument();
    
    // 가격 정보
    expect(screen.getByText('₩450K')).toBeInTheDocument();
    expect(screen.getByText('₩285K')).toBeInTheDocument();
    expect(screen.getByText('₩900K')).toBeInTheDocument();
    expect(screen.getByText('₩240K')).toBeInTheDocument();
    expect(screen.getByText('₩675K')).toBeInTheDocument();
  });

  test('shows time information for each trade', () => {
    render(<RecentTrades />);
    
    expect(screen.getByText('2분 전')).toBeInTheDocument();
    expect(screen.getByText('5분 전')).toBeInTheDocument();
    expect(screen.getByText('8분 전')).toBeInTheDocument();
    expect(screen.getByText('12분 전')).toBeInTheDocument();
    expect(screen.getByText('15분 전')).toBeInTheDocument();
  });

  test('renders with Card component wrapper', () => {
    render(<RecentTrades />);
    
    const card = screen.getByText('🔄 최근 거래 내역').closest('.card');
    expect(card).toHaveClass('card--elevated');
  });

  test('handles empty trades gracefully', () => {
    // 빈 거래 데이터로 모킹
    jest.doMock('../../data/mockData', () => ({
      recentTradesData: []
    }));
    
    const { rerender } = render(<RecentTrades />);
    
    // 빈 상태에서도 헤더는 표시되어야 함
    expect(screen.getByText('🔄 최근 거래 내역')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '전체보기' })).toBeInTheDocument();
  });
});
