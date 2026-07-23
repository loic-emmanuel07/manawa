import React from 'react';

const DateSeparator = ({ date }) => {
  return (
    <div className="d-flex justify-content-center my-3 select-none">
      <span 
        className="px-3 py-1 rounded-pill text-secondary bg-light text-truncate"
        style={{ 
          fontSize: '0.75rem', 
          fontWeight: '600',
          border: '1px solid #f1f3f5',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        {date}
      </span>
    </div>
  );
};

export default DateSeparator;
