import { create } from 'zustand';

export const useMainStore = create((set, get) => ({
  // 거래 데이터
  deals: [],
  isLoading: true,
  
  // 사용자 정보
  userAvatar: null,
  userNickname: '',
  
  // 모달 상태
  isSellModalOpen: false,
  isBuyModalOpen: false,
  isSellerModalOpen: false,
  isMessageModalOpen: false,
  
  // 선택된 데이터
  selectedSeller: null,
  selectedDeal: null,
  
  // 필터 및 검색
  statusFilter: 'all',
  typeFilter: 'all',
  searchTerm: '',
  
  // 페이지네이션
  currentPage: 1,
  itemsPerPage: 10,
  
  // 페이지 로딩 상태
  isPageLoaded: false,
  
  // 필터 옵션들
  statusOptions: [
    { value: 'all', label: '전체 상태' },
    { value: 'selling', label: '판매 중' },
    { value: 'completed', label: '거래 완료' }
  ],
  
  typeOptions: [
    { value: 'all', label: '전체 유형' },
    { value: 'sell', label: '🔴 판매' },
    { value: 'buy', label: '🟢 구매' }
  ],
  
  itemsPerPageOptions: [
    { value: 5, label: '5개씩' },
    { value: 10, label: '10개씩' },
    { value: 20, label: '20개씩' },
    { value: 50, label: '50개씩' }
  ],
  
  // Actions
  setDeals: (deals) => set({ deals }),
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setUserAvatar: (userAvatar) => set({ userAvatar }),
  setUserNickname: (userNickname) => set({ userNickname }),
  
  openSellModal: () => set({ isSellModalOpen: true }),
  closeSellModal: () => set({ isSellModalOpen: false }),
  
  openBuyModal: () => set({ isBuyModalOpen: true }),
  closeBuyModal: () => set({ isBuyModalOpen: false }),
  
  openSellerModal: (seller) => set({ 
    isSellerModalOpen: true, 
    selectedSeller: seller 
  }),
  closeSellerModal: () => set({ 
    isSellerModalOpen: false, 
    selectedSeller: null 
  }),
  
  openMessageModal: (deal) => set({ 
    isMessageModalOpen: true, 
    selectedDeal: deal 
  }),
  closeMessageModal: () => set({ 
    isMessageModalOpen: false, 
    selectedDeal: null 
  }),
  
  setStatusFilter: (filter) => set({ 
    statusFilter: filter, 
    currentPage: 1 
  }),
  
  setTypeFilter: (filter) => set({ 
    typeFilter: filter, 
    currentPage: 1 
  }),
  
  setSearchTerm: (term) => set({ 
    searchTerm: term, 
    currentPage: 1 
  }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (items) => set({ 
    itemsPerPage: items, 
    currentPage: 1 
  }),
  
  setIsPageLoaded: (loaded) => set({ isPageLoaded: loaded }),
  
  // Computed values
  getFilteredDeals: () => {
    const { deals, statusFilter, typeFilter, searchTerm } = get();
    
    return deals.filter(deal => {
      const statusMatch = statusFilter === 'all' || deal.status === statusFilter;
      const typeMatch = typeFilter === 'all' || deal.type === typeFilter;
      const searchMatch = searchTerm === '' || 
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.seller.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && typeMatch && searchMatch;
    });
  },
  
  getPaginationInfo: () => {
    const { currentPage, itemsPerPage } = get();
    const filteredDeals = get().getFilteredDeals();
    
    const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDeals = filteredDeals.slice(startIndex, endIndex);
    
    return {
      totalPages,
      startIndex,
      endIndex,
      currentDeals,
      totalItems: filteredDeals.length
    };
  }
}));
