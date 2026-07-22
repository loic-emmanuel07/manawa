import React from 'react';

const NewChatFAB = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="position-absolute rounded-circle d-flex d-md-none align-items-center justify-content-center redline-fab text-white"
      style={{
        bottom: '24px',
        right: '24px',
        width: '52px',
        height: '52px',
        zIndex: 10,
      }}
      title="Nouvelle discussion"
    >
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
};

export default NewChatFAB;
