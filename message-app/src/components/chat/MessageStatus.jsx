import React from 'react';

const MessageStatus = ({ status }) => {
  if (status === 'sent') {
    return (
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-secondary opacity-75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }

  if (status === 'received') {
    return (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-secondary opacity-75">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7M2 13l3 3 7-7" />
      </svg>
    );
  }

  if (status === 'read') {
    return (
      <svg width="16" height="16" fill="none" stroke="var(--redline-accent)" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7M2 13l3 3 7-7" />
      </svg>
    );
  }

  return null;
};

export default MessageStatus;
