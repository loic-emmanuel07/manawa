import React, { useState } from 'react';
import HomeScreen from './sidebar/HomeScreen';
import ChatScreen from './chat/ChatScreen';

const MainLayout = () => {
  const [activeChatId, setActiveChatId] = useState(null);

  return (
    // Conteneur principal plein écran en Bootstrap
    <div className="d-flex vh-100 vw-100 overflow-hidden bg-light">
      
      {/* --- ZONE GAUCHE (SIDEBAR / HOMESCREEN) --- */}
      {/* 
        Sur Mobile: Masquée si un chat est actif.
        Sur Desktop (d-md-block): Reste toujours visible avec une largeur de 380px.
      */}
      <div 
        className={`flex-shrink-0 border-end bg-white h-100 ${
          activeChatId ? 'd-none d-md-block' : 'd-block'
        }`}
        style={{ width: '380px' }}
      >
        <HomeScreen onSelectChat={(id) => setActiveChatId(id)} activeChatId={activeChatId} />
      </div>

      {/* --- ZONE DROITE (CHAT / CHATSCREEN) --- */}
      {/* 
        Sur Mobile: Visible seulement si un chat est sélectionné.
        Sur Desktop: Prend tout le reste de l'espace (flex-grow-1).
      */}
      <div 
        className={`flex-grow-1 h-100 ${
          !activeChatId ? 'd-none d-md-block' : 'd-block'
        }`}
      >
        {activeChatId ? (
          <ChatScreen activeChatId={activeChatId} onBack={() => setActiveChatId(null)} />
        ) : (
          <div className="h-100 d-flex flex-column align-items-center justify-content-center bg-light p-4">
            <div className="text-center">
              <h2 className="fs-4 fw-bold text-secondary">Sélectionnez un message</h2>
              <p className="text-muted mt-2 small" style={{ maxWidth: '350px' }}>
                Choisissez une discussion dans la liste de gauche ou commencez-en une nouvelle pour échanger.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
} 

export default MainLayout;