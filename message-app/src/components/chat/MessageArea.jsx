import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import DateSeparator from './DateSeparator';

const MessageArea = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Scroll to bottom when messages load or change
  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages]);

  // Group messages by day and render them with DateSeparators
  const renderMessages = () => {
    const rendered = [];
    let lastDate = null;

    messages.forEach((msg, idx) => {
      const msgDate = msg.dateLabel || 'Aujourd\'hui';

      if (msgDate !== lastDate) {
        rendered.push(
          <DateSeparator key={`date-${msg.id || idx}`} date={msgDate} />
        );
        lastDate = msgDate;
      }

      rendered.push(
        <MessageBubble key={msg.id || idx} message={msg} />
      );
    });

    return rendered;
  };

  return (
    <div 
      ref={containerRef}
      className="flex-grow-1 overflow-y-auto py-3 custom-scrollbar"
      style={{ 
        backgroundColor: '#fafaf9',
        backgroundImage: 'radial-gradient(#e5e7eb 0.75px, transparent 0.75px)',
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0'
      }}
    >
      {messages.length === 0 ? (
        <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-4 select-none">
          <svg width="48" height="48" fill="none" stroke="var(--redline-accent)" strokeWidth="1.5" viewBox="0 0 24 24" className="opacity-50 mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.92 1.78 5.962 5.962 0 003.16-.921c.556-.329 1.191-.223 1.741.042A9.762 9.762 0 0012 20.25z" />
          </svg>
          <p className="text-muted fw-bold mb-1" style={{ fontSize: '0.95rem' }}>Aucun message</p>
          <p className="text-secondary small" style={{ maxWidth: '240px' }}>Envoyez un message pour commencer la conversation.</p>
        </div>
      ) : (
        <>
          {renderMessages()}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageArea;
