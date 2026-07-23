import React, { useState, useEffect, useRef } from 'react';
import MessageStatus from './MessageStatus';

const MessageBubble = ({ message }) => {
  const { sender, text, time, status, type, duration } = message;
  const isSent = sender === 'me';

  // Voice note simulator states
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const playTimerRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      const step = 100 / (duration || 5); // steps per second
      playTimerRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(playTimerRef.current);
            return 0;
          }
          return prev + (step / 10); // 10 updates per second for smooth transition
        });
      }, 100);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, duration]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className={`d-flex ${isSent ? 'justify-content-end' : 'justify-content-start'} mb-3 px-3`}>
      <div 
        className="position-relative shadow-sm"
        style={{
          maxWidth: '70%',
          padding: '10px 14px',
          borderRadius: isSent 
            ? '16px 16px 4px 16px' 
            : '16px 16px 16px 4px',
          backgroundColor: isSent ? 'var(--redline-accent)' : '#ffffff',
          color: isSent ? '#ffffff' : 'var(--redline-text-primary)',
          border: isSent ? 'none' : '1px solid #f1f3f5',
          animation: 'bubbleFadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {type === 'voice' ? (
          /* Voice note card */
          <div className="d-flex align-items-center gap-3 py-1" style={{ minWidth: '220px' }}>
            <button
              onClick={handlePlayToggle}
              className="btn rounded-circle d-flex align-items-center justify-content-center border-0 p-0"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: isSent ? 'rgba(255, 255, 255, 0.2)' : 'var(--redline-accent-light)',
                color: isSent ? '#ffffff' : 'var(--redline-accent)',
                transition: 'all 0.2s'
              }}
            >
              {isPlaying ? (
                /* Pause SVG */
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                </svg>
              ) : (
                /* Play SVG */
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style={{ marginLeft: '2px' }}>
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Waveform / Progress Slider */}
            <div className="flex-grow-1 d-flex flex-column gap-1">
              <div 
                className="position-relative w-100 rounded" 
                style={{ 
                  height: '4px', 
                  backgroundColor: isSent ? 'rgba(255, 255, 255, 0.3)' : '#e9ecef',
                  overflow: 'hidden' 
                }}
              >
                <div 
                  className="position-absolute top-0 start-0 h-100 rounded"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: isSent ? '#ffffff' : 'var(--redline-accent)',
                    transition: 'width 0.1s linear'
                  }}
                />
              </div>
              <div className="d-flex justify-content-between align-items-center select-none" style={{ fontSize: '0.65rem' }}>
                <span className={isSent ? 'text-white-50' : 'text-muted'}>
                  {formatDuration(isPlaying ? (progress / 100) * (duration || 5) : (duration || 5))}
                </span>
                <span className={isSent ? 'text-white-50' : 'text-muted'} style={{ letterSpacing: '0.5px' }}>
                  Note vocale
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Text message */
          <p className="m-0 text-break" style={{ fontSize: '0.92rem', lineHeight: '1.4' }}>
            {text}
          </p>
        )}

        {/* Time Stamp & Status Info bar */}
        <div 
          className="d-flex align-items-center justify-content-end gap-1 mt-1 select-none" 
          style={{ 
            fontSize: '0.68rem', 
            opacity: 0.8,
            fontFamily: "'JetBrains Mono', monospace"
          }}
        >
          <span className={isSent ? 'text-white-50' : 'text-muted'}>{time}</span>
          {isSent && <MessageStatus status={status} />}
        </div>
      </div>

      <style>{`
        @keyframes bubbleFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MessageBubble;
