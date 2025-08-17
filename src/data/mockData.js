// Mock 데이터 - 회사별로 필터링, 7일 후 만료
export const mockDeals = [
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
    status: 'completed',
    type: 'sell',
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
    company: '고려해운'
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
    company: '고려해운'
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
    company: '고려해운'
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
    company: '고려해운'
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
    company: '고려해운'
  },
  {
    id: 9,
    title: '식권 포인트 120만점 구매',
    seller: '구매희망자3',
    points: 1200000,
    price: 1080000,
    status: 'selling',
    type: 'buy',
    views: 89,
    sellerRating: 4.7,
    sellerDeals: 41,
    company: '고려해운'
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
    company: '고려해운'
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
    company: '고려해운'
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
    company: '고려해운'
  }
];

// 7일 후 날짜 계산 함수
export const getExpiryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
};

// 10만 포인트 기준 현금 거래 데이터 (24시간)
export const getPointPriceData = () => {
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

// 최근 거래 내역 데이터
export const recentTradesData = [
  { id: 1, type: 'buy', user: '익명거래자1', points: '50만', price: '₩450K', time: '2분 전' },
  { id: 2, type: 'sell', user: '익명거래자2', points: '30만', price: '₩285K', time: '5분 전' },
  { id: 3, type: 'buy', user: '익명거래자3', points: '100만', price: '₩900K', time: '8분 전' },
  { id: 4, type: 'sell', user: '익명거래자4', points: '25만', price: '₩240K', time: '12분 전' },
  { id: 5, type: 'buy', user: '익명거래자5', points: '75만', price: '₩675K', time: '15분 전' }
];

// 회사별 도메인 매핑
export const companyDomainMap = {
  'ekmtc.com': '고려해운',
  'tescom.com': '테스콤',
  'samsungcard.com': '삼성카드'
};

// 기본값
export const defaultCompanyName = 'Black Market';
