// 업적 데이터
export const achievements = [
  // 거래 관련 기본 업적
  {
    id: "first_trade",
    name: "첫 거래",
    description: "첫 번째 거래를 완료하세요",
    category: "trade",
    requirement: { type: "trade_count", value: 1 },
    reward: { badge: "first_trade", exp: 100 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "🎯"
  },
  {
    id: "trade_10",
    name: "거래 초보자",
    description: "10회 거래를 완료하세요",
    category: "trade",
    requirement: { type: "trade_count", value: 10 },
    reward: { badge: "trade_beginner", exp: 200 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "🥉"
  },
  {
    id: "trade_50",
    name: "거래 중급자",
    description: "50회 거래를 완료하세요",
    category: "trade",
    requirement: { type: "trade_count", value: 50 },
    reward: { badge: "trade_intermediate", exp: 500 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "🥈"
  },
  {
    id: "trade_100",
    name: "거래 전문가",
    description: "100회 거래를 완료하세요",
    category: "trade",
    requirement: { type: "trade_count", value: 100 },
    reward: { badge: "trade_expert", exp: 1000 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "🥇"
  },
  {
    id: "trade_500",
    name: "거래왕",
    description: "500회 거래를 완료하세요",
    category: "trade",
    requirement: { type: "trade_count", value: 500 },
    reward: { badge: "trade_king", exp: 5000 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "👑"
  },
  
  // 금액 관련 업적
  {
    id: "money_100k",
    name: "소액 거래자",
    description: "총 거래 금액 100만원 달성",
    category: "money",
    requirement: { type: "total_amount", value: 1000000 },
    reward: { badge: "small_trader", exp: 300 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "💰"
  },
  {
    id: "money_10m",
    name: "중간 거래자",
    description: "총 거래 금액 1000만원 달성",
    category: "money",
    requirement: { type: "total_amount", value: 10000000 },
    reward: { badge: "medium_trader", exp: 800 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "💎"
  },
  {
    id: "money_100m",
    name: "대부",
    description: "총 거래 금액 1억원 달성",
    category: "money",
    requirement: { type: "total_amount", value: 100000000 },
    reward: { badge: "big_trader", exp: 2000 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "🏦"
  },
  
  // 연속성 관련 업적
  {
    id: "streak_7",
    name: "불꽃 거래자",
    description: "7일 연속 거래",
    category: "streak",
    requirement: { type: "consecutive_days", value: 7 },
    reward: { badge: "fire_trader", exp: 400 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "🔥"
  },
  {
    id: "streak_30",
    name: "번개 거래자",
    description: "30일 연속 거래",
    category: "streak",
    requirement: { type: "consecutive_days", value: 30 },
    reward: { badge: "lightning_trader", exp: 1500 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "⚡"
  },
  
  // 특별한 거래 업적
  {
    id: "big_deal",
    name: "정확한 손길",
    description: "한 번에 100만원 이상 거래",
    category: "special",
    requirement: { type: "single_deal_amount", value: 1000000 },
    reward: { badge: "precise_hand", exp: 600 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "🎯"
  },
  {
    id: "daily_10",
    name: "행운의 여신",
    description: "하루에 10회 이상 거래",
    category: "special",
    requirement: { type: "daily_trade_count", value: 10 },
    reward: { badge: "lucky_goddess", exp: 400 },
    progress: 0,
    completed: false,
    completedAt: null,
    icon: "🍀"
  }
];

// 칭호 데이터
export const badges = [
  {
    id: "first_trade",
    name: "첫 거래",
    description: "첫 번째 거래 완료",
    icon: "🎯",
    rarity: "common",
    unlocked: false,
    unlockedAt: null,
    category: "trade"
  },
  {
    id: "trade_beginner",
    name: "거래 초보자",
    description: "10회 거래 달성",
    icon: "🥉",
    rarity: "common",
    unlocked: false,
    unlockedAt: null,
    category: "trade"
  },
  {
    id: "trade_intermediate",
    name: "거래 중급자",
    description: "50회 거래 달성",
    icon: "🥈",
    rarity: "uncommon",
    unlocked: false,
    unlockedAt: null,
    category: "trade"
  },
  {
    id: "trade_expert",
    name: "거래 전문가",
    description: "100회 거래 달성",
    icon: "🥇",
    rarity: "rare",
    unlocked: false,
    unlockedAt: null,
    category: "trade"
  },
  {
    id: "trade_king",
    name: "거래왕",
    description: "500회 거래 달성",
    icon: "👑",
    rarity: "legendary",
    unlocked: false,
    unlockedAt: null,
    category: "trade"
  },
  {
    id: "small_trader",
    name: "소액 거래자",
    description: "총 거래 금액 100만원 달성",
    icon: "💰",
    rarity: "common",
    unlocked: false,
    unlockedAt: null,
    category: "money"
  },
  {
    id: "medium_trader",
    name: "중간 거래자",
    description: "총 거래 금액 1000만원 달성",
    icon: "💎",
    rarity: "uncommon",
    unlocked: false,
    unlockedAt: null,
    category: "money"
  },
  {
    id: "big_trader",
    name: "대부",
    description: "총 거래 금액 1억원 달성",
    icon: "🏦",
    rarity: "epic",
    unlocked: false,
    unlockedAt: null,
    category: "money"
  },
  {
    id: "fire_trader",
    name: "불꽃 거래자",
    description: "7일 연속 거래",
    icon: "🔥",
    rarity: "uncommon",
    unlocked: false,
    unlockedAt: null,
    category: "streak"
  },
  {
    id: "lightning_trader",
    name: "번개 거래자",
    description: "30일 연속 거래",
    icon: "⚡",
    rarity: "rare",
    unlocked: false,
    unlockedAt: null,
    category: "streak"
  },
  {
    id: "precise_hand",
    name: "정확한 손길",
    description: "한 번에 100만원 이상 거래",
    icon: "🎯",
    rarity: "uncommon",
    unlocked: false,
    unlockedAt: null,
    category: "special"
  },
  {
    id: "lucky_goddess",
    name: "행운의 여신",
    description: "하루에 10회 이상 거래",
    icon: "🍀",
    rarity: "rare",
    unlocked: false,
    unlockedAt: null,
    category: "special"
  }
];

// 칭호 희귀도별 색상
export const rarityColors = {
  common: "#9e9e9e",      // 회색
  uncommon: "#4caf50",    // 초록색
  rare: "#2196f3",        // 파란색
  epic: "#9c27b0",        // 보라색
  legendary: "#ff9800"    // 주황색
};

// 업적 카테고리별 색상
export const categoryColors = {
  trade: "#4caf50",       // 초록색
  money: "#ff9800",       // 주황색
  streak: "#f44336",      // 빨간색
  special: "#9c27b0"      // 보라색
};
