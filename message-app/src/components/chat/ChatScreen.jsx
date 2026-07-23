import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';

// Demo messages data mapped by chat/conversation ID
const INITIAL_MESSAGES_MAP = {
  '1': [
    { id: 'm1_1', sender: 'them', text: 'Salut ! Tu as vu le projet ?', time: '14:30', dateLabel: 'Hier' },
    { id: 'm1_2', sender: 'me', text: 'Oui, j\'ai jeté un coup d\'œil. Ça a l\'air super clean !', time: '14:32', status: 'read', dateLabel: 'Hier' },
    { id: 'm1_3', sender: 'them', text: 'Top, on s\'associe pour la suite ?', time: '09:15', dateLabel: 'Aujourd\'hui' },
    { id: 'm1_4', sender: 'them', type: 'voice', duration: 12, time: '09:17', dateLabel: 'Aujourd\'hui' }
  ],
  '2': [
    { id: 'm2_1', sender: 'me', text: 'Hello Thomas, tu as pu avancer sur la maquette ?', time: '18:00', status: 'read', dateLabel: 'Hier' },
    { id: 'm2_2', sender: 'them', text: 'Je t\'envoie ça ce soir.', time: '18:05', dateLabel: 'Hier' }
  ],
  '3': [
    { id: 'm3_1', sender: 'them', text: 'Voilà les retours de l\'équipe sur la V1.', time: '10:00', dateLabel: '15 juillet 2026' },
    { id: 'm3_2', sender: 'me', text: 'Génial, merci beaucoup ! 👍', time: '10:15', status: 'read', dateLabel: '15 juillet 2026' }
  ],
  '4': [
    { id: 'm4_1', sender: 'them', text: 'On se capte demain ?', time: '11:30', dateLabel: '12 juillet 2026' },
    { id: 'm4_2', sender: 'me', text: 'Ça marche ! À quelle heure ?', time: '11:35', status: 'read', dateLabel: '12 juillet 2026' }
  ]
};

// Map of contact details for rendering header
const CONTACTS_MAP = {
  '1': { name: 'Alice Martin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', online: true },
  '2': { name: 'Thomas Dubois', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', online: false },
  '3': { name: 'Sarah Benali', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80', online: true },
  '4': { name: 'Marc Lefevre', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', online: false }
};

const ChatScreen = ({ activeChatId, onBack }) => {
  const [messagesMap, setMessagesMap] = useState(INITIAL_MESSAGES_MAP);
  const contact = CONTACTS_MAP[activeChatId];

  // Helper to get current formatted time
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSendMessage = (text) => {
    const newMessage = {
      id: `m_${Date.now()}`,
      sender: 'me',
      text,
      time: getCurrentTime(),
      status: 'sent',
      dateLabel: 'Aujourd\'hui'
    };

    // Update messages
    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));

    // Simulate status upgrade: sent -> received -> read
    setTimeout(() => {
      setMessagesMap((prev) => {
        const chatMsgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: chatMsgs.map((m) => m.id === newMessage.id ? { ...m, status: 'received' } : m)
        };
      });
    }, 1000);

    setTimeout(() => {
      setMessagesMap((prev) => {
        const chatMsgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: chatMsgs.map((m) => m.id === newMessage.id ? { ...m, status: 'read' } : m)
        };
      });
    }, 2000);

    // Dynamic auto response simulation to feel premium and alive
    setTimeout(() => {
      const responseMsg = {
        id: `reply_${Date.now()}`,
        sender: 'them',
        text: `Merci pour ton message ! J'ai bien reçu : "${text}"`,
        time: getCurrentTime(),
        dateLabel: 'Aujourd\'hui'
      };

      setMessagesMap((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), responseMsg]
      }));
    }, 3500);
  };

  const handleSendVoiceNote = (duration) => {
    const voiceMessage = {
      id: `voice_${Date.now()}`,
      sender: 'me',
      type: 'voice',
      duration,
      time: getCurrentTime(),
      status: 'sent',
      dateLabel: 'Aujourd\'hui'
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), voiceMessage]
    }));

    // Simulate status update
    setTimeout(() => {
      setMessagesMap((prev) => {
        const chatMsgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: chatMsgs.map((m) => m.id === voiceMessage.id ? { ...m, status: 'received' } : m)
        };
      });
    }, 1000);

    setTimeout(() => {
      setMessagesMap((prev) => {
        const chatMsgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: chatMsgs.map((m) => m.id === voiceMessage.id ? { ...m, status: 'read' } : m)
        };
      });
    }, 2000);
  };

  const currentMessages = messagesMap[activeChatId] || [];

  return (
    <div className="h-100 d-flex flex-column bg-white">
      {/* 1. Header component */}
      <ChatHeader activeChat={contact} onBack={onBack} />

      {/* 2. Message Area timeline */}
      <MessageArea messages={currentMessages} />

      {/* 3. Message Input component */}
      <MessageInput 
        onSendMessage={handleSendMessage} 
        onSendVoiceNote={handleSendVoiceNote} 
      />
    </div>
  );
};

export default ChatScreen;
