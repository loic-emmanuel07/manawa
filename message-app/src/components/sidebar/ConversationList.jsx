import React from 'react';
import ConversationItem from './ConversationItem';

const ConversationList = ({ conversations, activeChatId, onSelectChat }) => {
  if (conversations.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center px-3">
        <svg className="text-secondary-subtle mb-2" width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025 10.33 10.33 0 01-1.39-3.751C3.539 14.162 3 13.139 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
        <p className="text-muted small m-0">Aucune discussion trouvée</p>
      </div>
    );
  }

  return (
    <div className="flex-grow-1 overflow-y-auto bg-white custom-scrollbar">
      {conversations.map((chat) => (
        <ConversationItem
          key={chat.id}
          conversation={chat}
          isActive={chat.id === activeChatId}
          onClick={() => onSelectChat(chat.id)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
