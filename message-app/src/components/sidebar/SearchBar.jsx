import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="px-3 py-2 bg-white">
      <div className="position-relative d-flex align-items-center">
        {/* Search icon */}
        <span className="position-absolute start-0 ps-3 text-muted d-flex align-items-center" style={{ pointerEvents: 'none' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        {/* Input field */}
        <input
          type="text"
          placeholder="Rechercher ou démarrer une discussion..."
          onChange={(e) => onSearch(e.target.value)}
          className="form-control rounded-pill py-2 ps-5 pe-3 redline-search-input text-sm"
          style={{ fontSize: '0.85rem' }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
