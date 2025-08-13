import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import Button from './Button';
import DropdownSelect from './DropdownSelect';
import Pagination from './Pagination';
import '../styles/components/DealsBoard.css';

const DealsBoard = ({
  // 데이터 props
  deals = [],
  statusFilter = 'all',
  typeFilter = 'all',
  searchTerm = '',
  currentPage = 1,
  itemsPerPage = 10,
  statusOptions = [],
  typeOptions = [],
  itemsPerPageOptions = [],
  filteredDeals = [],
  totalPages = 1,
  totalItems = 0,
  
  // 이벤트 핸들러 props
  onSellerClick,
  onTradeRequest,
  onStatusFilterChange,
  onTypeFilterChange,
  onItemsPerPageChange,
  onSearchChange,
  onPageChange,
  
  // UI 설정 props
  className = '',
  showFilters = true,
  showPagination = true,
  showSearch = true,
  maxItemsPerPage = 50,
  isPageLoaded = false
}) => {
  
  // 검색 핸들러
  const handleSearchChange = useCallback((e) => {
    if (onSearchChange) {
      onSearchChange(e);
    }
  }, [onSearchChange]);

  // 필터 변경 핸들러
  const handleStatusFilterChange = useCallback((option) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(option);
    }
  }, [onStatusFilterChange]);

  const handleTypeFilterChange = useCallback((option) => {
    if (onTypeFilterChange) {
      onTypeFilterChange(option);
    }
  }, [onTypeFilterChange]);

  const handleItemsPerPageChange = useCallback((option) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(option);
    }
  }, [onItemsPerPageChange]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  }, [onPageChange]);

  // 현재 선택된 필터 값들 찾기
  const currentStatusFilter = useMemo(() => {
    return statusOptions.find(option => option.value === statusFilter) || statusOptions[0];
  }, [statusFilter, statusOptions]);

  const currentTypeFilter = useMemo(() => {
    return typeOptions.find(option => option.value === typeFilter) || typeOptions[0];
  }, [typeFilter, typeOptions]);

  const currentItemsPerPage = useMemo(() => {
    return itemsPerPageOptions.find(option => option.value === itemsPerPage) || itemsPerPageOptions[1];
  }, [itemsPerPage, itemsPerPageOptions]);

  // 데이터가 없을 때 처리
  if (!deals.length) {
    return (
      <div className={`deals-board ${className}`}>
        <div className="no-deals-message">
          <p>거래 데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`deals-board ${className}`}>
      <div className="board-header">
        {showSearch && (
          <div className="search-container">
            <input
              type="text"
              placeholder="제목 또는 작성자로 검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        )}
        {showFilters && (
          <div className="board-filters">
            <DropdownSelect
              options={typeOptions}
              value={currentTypeFilter}
              onChange={handleTypeFilterChange}
              placeholder="전체 유형"
              className="type-filter"
            />
            <DropdownSelect
              options={statusOptions}
              value={currentStatusFilter}
              onChange={handleStatusFilterChange}
              placeholder="전체 상태"
              className="status-filter"
            />
            <DropdownSelect
              options={itemsPerPageOptions.filter(option => option.value <= maxItemsPerPage)}
              value={currentItemsPerPage}
              onChange={handleItemsPerPageChange}
              placeholder="10개씩"
              className="items-per-page-filter"
            />
          </div>
        )}
      </div>
      
      <div className="board-table">
        <div className="table-header">
          <div className="header-cell">구분</div>
          <div className="header-cell">제목</div>
          <div className="header-cell">작성자</div>
          <div className="header-cell">포인트</div>
          <div className="header-cell">가격</div>
          <div className="header-cell">조회수</div>
          <div className="header-cell">상태</div>
          <div className="header-cell">작업</div>
        </div>
        
        {filteredDeals && filteredDeals.length > 0 ? (
          filteredDeals.map((deal) => (
            <div key={deal.id} className="table-row">
              <div className="table-cell">
                <span className={`deal-type-badge ${deal.type}`}>
                  {deal.type === 'buy' ? '구매' : '판매'}
                </span>
              </div>
              <div className="table-cell deal-title">
                <span title={deal.title}>
                  {deal.title.length > 30 ? `${deal.title.substring(0, 30)}...` : deal.title}
                </span>
              </div>
              <div className="table-cell">
                <button
                  className="seller-button"
                  onClick={(e) => onSellerClick?.(deal, e)}
                >
                  {deal.seller}
                </button>
              </div>
              <div className="table-cell">
                {deal.points.toLocaleString()}점
              </div>
              <div className="table-cell">
                ₩{deal.price.toLocaleString()}
              </div>
              <div className="table-cell">
                {deal.views.toLocaleString()}회
              </div>
              <div className="table-cell">
                <span className={`deal-status-badge ${deal.status}`}>
                  {deal.status === 'selling' ? '거래 가능' : '거래 완료'}
                </span>
              </div>
              <div className="table-cell">
                <Button
                  variant={deal.status === 'selling' ? 'primary' : 'secondary'}
                  size="small"
                  disabled={deal.status === 'completed'}
                  className={deal.status === 'completed' ? 'deal-completed' : ''}
                  onClick={deal.status === 'selling' ? (e) => onTradeRequest?.(deal, e) : undefined}
                >
                  {deal.status === 'selling' ? '거래 신청' : '거래 완료'}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>검색 조건에 맞는 거래가 없습니다.</p>
          </div>
        )}
      </div>
      
      {showPagination && filteredDeals && filteredDeals.length > 0 && (
        <div className="pagination-container">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

// PropTypes 정의
DealsBoard.propTypes = {
  // 데이터 props
  deals: PropTypes.array,
  statusFilter: PropTypes.string,
  typeFilter: PropTypes.string,
  searchTerm: PropTypes.string,
  currentPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  statusOptions: PropTypes.array,
  typeOptions: PropTypes.array,
  itemsPerPageOptions: PropTypes.array,
  filteredDeals: PropTypes.array,
  totalPages: PropTypes.number,
  totalItems: PropTypes.number,
  
  // 이벤트 핸들러 props
  onSellerClick: PropTypes.func,
  onTradeRequest: PropTypes.func,
  onStatusFilterChange: PropTypes.func,
  onTypeFilterChange: PropTypes.func,
  onItemsPerPageChange: PropTypes.func,
  onSearchChange: PropTypes.func,
  onPageChange: PropTypes.func,
  
  // UI 설정 props
  className: PropTypes.string,
  showFilters: PropTypes.bool,
  showPagination: PropTypes.bool,
  showSearch: PropTypes.bool,
  maxItemsPerPage: PropTypes.number,
  isPageLoaded: PropTypes.bool
};

// 기본 Props
DealsBoard.defaultProps = {
  deals: [],
  statusFilter: 'all',
  typeFilter: 'all',
  searchTerm: '',
  currentPage: 1,
  itemsPerPage: 10,
  statusOptions: [],
  typeOptions: [],
  itemsPerPageOptions: [],
  filteredDeals: [],
  totalPages: 1,
  totalItems: 0,
  showFilters: true,
  showPagination: true,
  showSearch: true,
  maxItemsPerPage: 50,
  isPageLoaded: false
};

export default DealsBoard;
