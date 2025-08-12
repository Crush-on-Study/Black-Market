import { useState } from 'react';
import Button from './Button';
import '../styles/components/MessageModal.css';

function MessageModal({ 
  isOpen, 
  onClose, 
  deal, 
  messageType = 'trade' // 'trade' 또는 'general'
}) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    
    // 실제로는 백엔드 API 호출
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션
      console.log('쪽지 전송:', {
        to: deal?.seller || '상대방',
        message: message,
        type: messageType,
        dealId: deal?.id
      });
      
      // 성공 후 모달 닫기
      setMessage('');
      onClose();
    } catch (error) {
      console.error('쪽지 전송 실패:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  const getTitle = () => {
    if (messageType === 'trade') {
      return deal?.type === 'buy' ? '🟢 구매자에게 쪽지 보내기' : '🔴 판매자에게 쪽지 보내기';
    }
    return '💬 쪽지 보내기';
  };

  const getRecipient = () => {
    if (deal?.seller) {
      return deal.type === 'buy' ? `구매자: ${deal.seller}` : `판매자: ${deal.seller}`;
    }
    return '상대방';
  };

  return (
    <div className="message-modal-overlay" onClick={handleClose}>
      <div className="message-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getTitle()}</h2>
          <button className="close-button" onClick={handleClose}>✕</button>
        </div>
        
        <div className="modal-content">
          <div className="recipient-info">
            <span className="label">받는 사람:</span>
            <span className="recipient">{getRecipient()}</span>
          </div>
          
          {deal && (
            <div className="deal-info">
              <span className="label">거래 정보:</span>
              <span className="deal-title">{deal.title}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="message-input-group">
              <label htmlFor="message">쪽지 내용:</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="거래에 대한 문의사항이나 제안을 작성해주세요..."
                rows={6}
                maxLength={500}
                required
              />
              <div className="character-count">
                {message.length}/500
              </div>
            </div>
            
            <div className="modal-actions">
              <Button 
                type="button" 
                variant="outline" 
                size="medium" 
                onClick={handleClose}
                disabled={isSending}
              >
                취소
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="medium"
                disabled={isSending || !message.trim()}
              >
                {isSending ? '전송 중...' : '쪽지 보내기'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
