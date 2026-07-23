import React from 'react';

const EMOJI_CATEGORIES = [
  {
    title: 'Récents & Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭']
  },
  {
    title: 'Gestes & Cœur',
    emojis: ['👍', '👎', '👌', '🤌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🔥', '✨', '🌟', '⭐']
  },
  {
    title: 'Animaux & Nature',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰', '🪲', '🪳', '🦂', '🕷️', '🕸️']
  }
];

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  return (
    <div 
      className="card border-0 shadow-lg position-absolute start-0 bottom-100 mb-2 p-3 bg-white"
      style={{ 
        width: '320px', 
        maxHeight: '350px', 
        zIndex: 1000, 
        borderRadius: '16px',
        border: '1px solid #f1f3f5 !important' 
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom border-light">
        <span className="fw-bold text-dark fs-6">Émojis</span>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose} 
          style={{ fontSize: '0.75rem' }}
          aria-label="Fermer"
        ></button>
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-grow-1" style={{ maxHeight: '260px' }}>
        {EMOJI_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="mb-3">
            <h6 className="text-muted fw-bold mb-2" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {cat.title}
            </h6>
            <div className="d-flex flex-wrap gap-1">
              {cat.emojis.map((emoji, emojiIdx) => (
                <button
                  key={emojiIdx}
                  type="button"
                  onClick={() => onEmojiSelect(emoji)}
                  className="btn btn-light p-0 d-flex align-items-center justify-content-center rounded"
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    fontSize: '1.25rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    transition: 'transform 0.1s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f3f5';
                    e.currentTarget.style.transform = 'scale(1.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
