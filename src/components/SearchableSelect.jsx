import { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/components/SearchableSelect.css';

function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "선택해주세요",
  searchPlaceholder = "검색어를 입력하세요"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  // 검색어에 따른 옵션 필터링
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
    setHighlightedIndex(-1);
  }, [searchTerm, options]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 드롭다운 열기/닫기
  const toggleDropdown = useCallback(() => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setHighlightedIndex(-1);
      // 드롭다운이 열릴 때 검색창에 포커스
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // 옵션 선택
  const handleOptionSelect = useCallback((option) => {
    onChange(option.id);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  }, [onChange]);

  // 검색어 변경
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  }, [isOpen, filteredOptions, highlightedIndex, handleOptionSelect]);

  // 선택된 옵션 찾기
  const selectedOption = options.find(option => option.id === value);

  return (
    <div className="searchable-select" ref={selectRef}>
      {/* 선택된 값 표시 */}
      <div 
        className={`select-display ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption ? (
          <div className="selected-option">
            <span className="option-icon">{selectedOption.icon}</span>
            <div className="option-info">
              <span className="option-name">{selectedOption.name}</span>
              <span className="option-description">{selectedOption.description}</span>
            </div>
          </div>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className="dropdown-arrow">▼</span>
      </div>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="dropdown-menu">
          {/* 검색창 */}
          <div className="search-container">
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* 검색 결과 */}
          <div className="options-list" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.id}
                  className={`option-item ${highlightedIndex === index ? 'highlighted' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={highlightedIndex === index}
                >
                  <span className="option-icon">{option.icon}</span>
                  <div className="option-info">
                    <span className="option-name">{option.name}</span>
                    <span className="option-description">{option.description}</span>
                    {option.domain && (
                      <span className="option-domain">@{option.domain}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>검색 결과가 없습니다.</p>
                <p>다른 검색어를 시도해보세요.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
