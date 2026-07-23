import React, { useState, useRef, useEffect } from 'react';

const VoiceRecordButton = ({ onRecordStart, onRecordEnd, onRecordCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [dragX, setDragX] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleStart = (e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
    isDragging.current = true;
    setIsRecording(true);
    setDragX(0);
    if (onRecordStart) onRecordStart();
  };

  const handleMove = (e) => {
    if (!isDragging.current || !isRecording) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diffX = clientX - startX.current;
    
    // Only allow dragging to the left (negative values)
    if (diffX < 0) {
      setDragX(diffX);
      // Trigger cancellation if slid far enough (e.g., -120px)
      if (diffX < -120) {
        handleCancel();
      }
    } else {
      setDragX(0);
    }
  };

  const handleEnd = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    if (isRecording) {
      setIsRecording(false);
      if (dragX >= -120) {
        // Send recording if not cancelled
        const finalDuration = duration;
        if (onRecordEnd) onRecordEnd(finalDuration || 1);
      }
    }
    setDragX(0);
  };

  const handleCancel = () => {
    isDragging.current = false;
    setIsRecording(false);
    setDragX(0);
    if (onRecordCancel) onRecordCancel();
  };

  // Add global mouseup / touchend and mousemove / touchmove event listeners to handle movement outside the button
  useEffect(() => {
    const handleGlobalMove = (e) => handleMove(e);
    const handleGlobalEnd = (e) => handleEnd(e);

    if (isRecording) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchmove', handleGlobalMove, { passive: false });
      window.addEventListener('touchend', handleGlobalEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isRecording, dragX, duration]);

  return (
    <div className="position-relative d-flex align-items-center">
      {isRecording && (
        <div 
          className="position-absolute end-100 me-3 d-flex align-items-center bg-white rounded-pill border px-3 py-1 shadow-sm gap-3 select-none"
          style={{ 
            height: '46px', 
            zIndex: 99, 
            whiteSpace: 'nowrap',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          {/* Recording pulse dot */}
          <div className="d-flex align-items-center gap-2">
            <span className="rounded-circle bg-danger" style={{ width: '10px', height: '10px', animation: 'pulse 1s infinite' }}></span>
            <span className="fw-bold redline-time m-0 text-dark" style={{ fontSize: '0.85rem' }}>
              {formatDuration(duration)}
            </span>
          </div>

          {/* Simple waveform bar animations */}
          <div className="d-flex align-items-center gap-1 mx-1" style={{ height: '16px' }}>
            <span className="bg-danger rounded" style={{ width: '2px', height: '60%', animation: 'wave 0.8s ease-in-out infinite alternate' }}></span>
            <span className="bg-danger rounded" style={{ width: '2px', height: '100%', animation: 'wave 0.6s ease-in-out infinite alternate 0.1s' }}></span>
            <span className="bg-danger rounded" style={{ width: '2px', height: '40%', animation: 'wave 0.9s ease-in-out infinite alternate 0.2s' }}></span>
            <span className="bg-danger rounded" style={{ width: '2px', height: '80%', animation: 'wave 0.7s ease-in-out infinite alternate 0.3s' }}></span>
          </div>

          {/* Slide label */}
          <span 
            className="text-muted small d-flex align-items-center gap-1"
            style={{ 
              opacity: Math.max(0.2, 1 + dragX / 120),
              transition: 'opacity 0.1s ease'
            }}
          >
            <span style={{ animation: 'slideLeft 1.2s infinite' }}>◀</span>
            Glisser pour annuler
          </span>
        </div>
      )}

      {/* Main Microphone Action Button */}
      <button
        type="button"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        className="btn d-flex align-items-center justify-content-center rounded-circle border-0 shadow-sm"
        style={{
          width: '46px',
          height: '46px',
          backgroundColor: isRecording ? '#dc3545' : '#FAECE7',
          color: isRecording ? '#ffffff' : '#D85A30',
          transform: `translateX(${dragX}px) scale(${isRecording ? 1.15 : 1})`,
          transition: isDragging.current ? 'transform 0.05s ease-out, background-color 0.2s' : 'transform 0.2s ease, background-color 0.2s',
          cursor: isRecording ? 'grabbing' : 'pointer',
          zIndex: 100
        }}
        title="Maintenir pour enregistrer"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      </button>

      {/* Inject animations in index.css if needed, or inline style tag */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        @keyframes wave {
          0% { height: 25%; }
          100% { height: 100%; }
        }
        @keyframes slideLeft {
          0% { transform: translateX(2px); }
          50% { transform: translateX(-3px); }
          100% { transform: translateX(2px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateX(10px); }
          to { opacity: 1; transform: scale(1) translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default VoiceRecordButton;
