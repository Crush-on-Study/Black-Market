import Button from './Button';
import '../styles/components/Pagination.css';

function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    onPageChange(page);
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <div className="pagination-info">
        <span className="page-info">
          {startIndex + 1}-{endIndex} / {totalItems}개
        </span>
      </div>
      <div className="pagination-controls">
        <Button
          variant="secondary"
          size="small"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          ⏮️ 처음
        </Button>
        
        <Button
          variant="secondary"
          size="small"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ◀️ 이전
        </Button>
        
        <div className="page-numbers">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'primary' : 'secondary'}
                size="small"
                onClick={() => handlePageChange(pageNum)}
                className="page-number"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="secondary"
          size="small"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음 ▶️
        </Button>
        
        <Button
          variant="secondary"
          size="small"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          마지막 ⏭️
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
