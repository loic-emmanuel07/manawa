import React, { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import SearchBar from './SearchBar';
import StatusRow from './StatusRow';
import ConversationList from './ConversationList';
import NewChatFAB from './NewChatFAB';

// Demonstration data matching the redline design guidelines
const INITIAL_CONVERSATIONS = [
  {
    id: '1',
    name: 'Alice Martin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    lastMessage: 'Salut ! Tu as vu le projet ?',
    time: '14:32',
    unreadCount: 2,
    online: true
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    lastMessage: "Je t'envoie ça ce soir.",
    time: 'Hier',
    unreadCount: 0,
    online: false
  },
  {
    id: '3',
    name: 'Sarah Benali',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    lastMessage: 'Génial, merci beaucoup ! 👍',
    time: '15/07',
    unreadCount: 0,
    online: true
  },
  {
    id: '4',
    name: 'Marc Lefevre',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    lastMessage: 'On se capte demain ?',
    time: '12/07',
    unreadCount: 0,
    online: false
  }
];

const HomeScreen = ({ onSelectChat, activeChatId }) => {
  const [conversations] = useState(INITIAL_CONVERSATIONS);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations by contact name matching search query
  const filteredConversations = conversations.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    alert('Fonctionnalité "Nouvelle discussion" bientôt disponible !');
  };

  return (
    <div className="position-relative d-flex flex-column h-100 bg-white select-none">
      {/* 1. Profile Header */}
      <SidebarHeader onNewChat={handleNewChat} />

      {/* 2. Search Input */}
      <SearchBar onSearch={(query) => setSearchQuery(query)} />

      {/* 3. Status/Stories Horizontal Bar */}
      <StatusRow />

      {/* 4. Scrollable List of Chats */}
      <ConversationList
        conversations={filteredConversations}
        activeChatId={activeChatId}
        onSelectChat={onSelectChat}
      />

      {/* 5. Floating Action Button */}
      <NewChatFAB onClick={handleNewChat} />
    </div>
  );
};

export default HomeScreen;