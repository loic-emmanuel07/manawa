import React from 'react';

const ChatHeader = ({ activeChat, onBack }) => {
  if (!activeChat) return null;

  const { name, avatar, online } = activeChat;

  return (
    <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-white border-bottom border-light select-none">
      {/* Left section: Back Button & User Info */}
      <div className="d-flex align-items-center gap-2 min-w-0">
        {/* Mobile Back Button */}
        <button 
          onClick={onBack}
          className="btn btn-link p-1 text-secondary rounded-circle d-md-none d-flex align-items-center justify-content-center"
          style={{ width: '38px', height: '38px', transition: 'background-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Retour"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="position-relative flex-shrink-0">
          <img 
            src={avatar} 
            alt={name} 
            className="rounded-circle object-cover" 
            style={{ width: '40px', height: '40px', border: '1px solid #e9ecef' }}
          />
          {online && (
            <span 
              className="position-absolute bottom-0 right-0 rounded-circle border border-white bg-success"
              style={{ width: '10px', height: '10px', right: '1px', bottom: '1px' }}
            />
          )}
        </div>

        {/* Name & Status */}
        <div className="min-w-0">
          <h4 className="m-0 fs-6 fw-bold text-dark text-truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {name}
          </h4>
          <p className="m-0 text-muted" style={{ fontSize: '0.72rem', fontWeight: '500' }}>
            {online ? 'En ligne' : 'Hors ligne'}
          </p>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="d-flex align-items-center gap-1">
        {/* Audio Call */}
        <button 
          className="btn btn-link p-2 text-secondary rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '38px', height: '38px', transition: 'background-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Appel audio"
          onClick={() => alert('Fonctionnalité "Appel audio" bientôt disponible !')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.557-5.147-3.88-6.702-6.702l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </button>

        {/* Video Call */}
        <button 
          className="btn btn-link p-2 text-secondary rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '38px', height: '38px', transition: 'background-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Appel vidéo"
          onClick={() => alert('Fonctionnalité "Appel vidéo" bientôt disponible !')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </button>

        {/* Options */}
        <button 
          className="btn btn-link p-2 text-secondary rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '38px', height: '38px', transition: 'background-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Options"
          onClick={() => alert('Plus d\'options de discussion bientôt disponibles !')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
