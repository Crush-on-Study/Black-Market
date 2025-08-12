import { useState, useRef, useEffect } from 'react';
import '../styles/components/DropdownSelect.css';

function DropdownSelect({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "선택하세요",
  disabled = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 모든 옵션 표시 (검색 기능 제거)
  const filteredOptions = options;

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`dropdown-select ${className}`} ref={dropdownRef}>
      <div 
        className={`dropdown-header ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
      >
        <span className="selected-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="dropdown-arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="dropdown-menu">
          <div className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value || index}
                  className={`dropdown-option ${option.value === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                  {option.description && (
                    <span className="option-description">{option.description}</span>
                  )}
                </div>
              ))
            ) : (
              <div className="no-options">
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownSelect;
