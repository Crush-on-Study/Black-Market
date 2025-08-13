import { useMainStore } from '../stores/mainStore';
import Button from './Button';
import DropdownSelect from './DropdownSelect';
import Pagination from './Pagination';
import '../styles/components/DealsBoard.css';

const DealsBoard = ({ 
  isPageLoaded, 
  onSellerClick, 
  onTradeRequest,
  onStatusFilterChange,
  onTypeFilterChange,
  onItemsPerPageChange,
  onSearchChange,
  onPageChange
}) => {
  const { 
    deals, 
    statusFilter, 
    typeFilter, 
    searchTerm, 
    currentPage, 
    itemsPerPage,
    statusOptions,
    typeOptions,
    itemsPerPageOptions,
    getFilteredDeals,
    getPaginationInfo
  } = useMainStore();

  const filteredDeals = getFilteredDeals();
  const { totalPages, currentDeals, totalItems } = getPaginationInfo();

  return (
    <div className="deals-board">
      <div className="board-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="제목 또는 작성자로 검색..."
            value={searchTerm}
            onChange={onSearchChange}
            className="search-input"
          />
        </div>
        <div className="board-filters">
          <DropdownSelect
            options={typeOptions}
            value={typeFilter}
            onChange={onTypeFilterChange}
            placeholder="전체 유형"
            className="type-filter"
          />
          <DropdownSelect
            options={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
            placeholder="전체 상태"
            className="status-filter"
          />
          <DropdownSelect
            options={itemsPerPageOptions}
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
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
                onClick={(e) => onSellerClick(deal, e)}
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
                onClick={deal.status === 'selling' ? (e) => onTradeRequest(deal, e) : undefined}
              >
                {deal.status === 'selling' ? '거래 신청' : '거래 완료'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredDeals.length}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default DealsBoard;
