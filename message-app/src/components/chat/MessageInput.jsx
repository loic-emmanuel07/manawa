import React, { useState } from 'react';
import EmojiPicker from './EmojiPicker';
import VoiceRecordButton from './VoiceRecordButton';

const MessageInput = ({ onSendMessage, onSendVoiceNote }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji);
  };

  const handleVoiceRecordEnd = (duration) => {
    if (onSendVoiceNote) {
      onSendVoiceNote(duration);
    }
  };

  return (
    <div className="bg-white border-top border-light p-3 position-relative select-none">
      <form onSubmit={handleSubmit} className="d-flex align-items-center gap-2">
        {/* Emoji Button */}
        <div className="position-relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="btn btn-link p-2 text-secondary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Émojis"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </button>

          {/* Emoji Picker Popover */}
          {showEmojiPicker && (
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => alert('Fonctionnalité "Pièces jointes" bientôt disponible !')}
          className="btn btn-link p-2 text-secondary rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '40px', height: '40px', transition: 'background-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Joindre un fichier"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 0l-3.536 3.536m3.536-3.536L6.5 17.5m10.12-10.12a4.5 4.5 0 00-6.364-6.364l-6.36 6.36a6 6 0 008.486 8.487l6.36-6.36" />
          </svg>
        </button>

        {/* Input Text Field */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (showEmojiPicker) setShowEmojiPicker(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Taper un message..."
          className="form-control px-3 border-0 py-2 flex-grow-1"
          style={{
            backgroundColor: '#f1f3f5',
            borderRadius: '24px',
            fontSize: '0.95rem',
            outline: 'none',
            boxShadow: 'none'
          }}
        />

        {/* Action Button: Send or Voice Record */}
        {text.trim() ? (
          <button
            type="submit"
            className="btn d-flex align-items-center justify-content-center rounded-circle border-0 shadow-sm"
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: 'var(--redline-accent)',
              color: '#ffffff',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--redline-accent-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--redline-accent)'}
            title="Envoyer"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" style={{ transform: 'rotate(45deg)', marginLeft: '-2px', marginTop: '2px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        ) : (
          <VoiceRecordButton
            onRecordStart={() => {
              if (showEmojiPicker) setShowEmojiPicker(false);
            }}
            onRecordEnd={handleVoiceRecordEnd}
            onRecordCancel={() => {}}
          />
        )}
      </form>
    </div>
  );
};

export default MessageInput;
