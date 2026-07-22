import React from 'react';

const SidebarHeader = ({ onNewChat }) => {
  return (
    <div className="d-flex align-items-center justify-content-between px-3 py-3 bg-white border-bottom border-light">
      {/* Brand logo and application name */}
      <div className="d-flex align-items-center gap-2">
        <div 
          className="d-flex align-items-center justify-content-center rounded-3" 
          style={{ 
            width: '36px', 
            height: '36px', 
            backgroundColor: '#FAECE7',
            color: '#D85A30'
          }}
          title="redline"
        >
          <svg className="w-6 h-6" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            {/* Slanted connection/line with circles representing the redline logo */}
            <line x1="6" y1="18" x2="18" y2="6" />
            <circle cx="6" cy="18" r="2.5" fill="currentColor" />
            <circle cx="18" cy="6" r="2.5" fill="currentColor" />
          </svg>
        </div>
        <span className="fs-5 fw-bold redline-title m-0">redline</span>
      </div>

      {/* Action buttons */}
      <div className="d-flex align-items-center gap-2">
        {/* Chat / New Discussion Button - Visible only on PC/Desktop (d-none d-md-flex) */}
        <button 
          onClick={onNewChat}
          className="btn d-none d-md-flex align-items-center justify-content-center rounded-circle"
          style={{ 
            width: '38px', 
            height: '38px', 
            backgroundColor: '#FAECE7',
            color: '#D85A30',
            border: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D85A30';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FAECE7';
            e.currentTarget.style.color = '#D85A30';
          }}
          title="Nouvelle discussion"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025 10.33 10.33 0 01-1.39-3.751C3.539 14.162 3 13.139 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </button>

        {/* Options Button */}
        <button 
          className="btn btn-link p-2 text-secondary rounded-circle d-flex align-items-center justify-content-center"
          style={{ transition: 'background-color 0.2s', width: '38px', height: '38px' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Options"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;