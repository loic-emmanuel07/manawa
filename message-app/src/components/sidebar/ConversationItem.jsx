import React from 'react';

const ConversationItem = ({ conversation, isActive, onClick }) => {
  const { name, avatar, lastMessage, time, unreadCount, online } = conversation;

  return (
    <div
      onClick={onClick}
      className={`conversation-item d-flex align-items-center justify-content-between px-3 py-3 cursor-pointer ${
        isActive ? 'active' : ''
      }`}
    >
      <div className="d-flex align-items-center gap-3 min-w-0 flex-grow-1">
        {/* Contact Avatar */}
        <div className="position-relative flex-shrink-0">
          <img
            src={avatar}
            alt={name}
            className="rounded-circle object-fit-cover"
            style={{ width: '46px', height: '46px' }}
          />
          {online && (
            <span 
              className="position-absolute bottom-0 end-0 rounded-circle border border-white"
              style={{ 
                width: '11px', 
                height: '11px', 
                backgroundColor: '#D85A30',
                transform: 'translate(10%, 10%)'
              }}
            ></span>
          )}
        </div>

        {/* Content detail */}
        <div className="min-w-0 flex-grow-1">
          <h4 className="m-0 fs-6 fw-bold redline-title text-truncate">{name}</h4>
          <p className="m-0 text-muted text-truncate mt-1 redline-message" style={{ fontSize: '0.8rem' }}>
            {lastMessage}
          </p>
        </div>
      </div>

      {/* Date/Time and Unread count badge */}
      <div className="d-flex flex-column align-items-end flex-shrink-0 ms-2">
        <span className="redline-time">{time}</span>
        {unreadCount > 0 ? (
          <span 
            className="badge rounded-pill unread-badge mt-1 d-flex align-items-center justify-content-center"
            style={{ minWidth: '18px', height: '18px', fontSize: '9px', fontWeight: 'bold' }}
          >
            {unreadCount}
          </span>
        ) : (
          <div style={{ height: '18px' }}></div>
        )}
      </div>
    </div>
  );
};

export default ConversationItem;
