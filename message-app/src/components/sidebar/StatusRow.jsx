import React from 'react';

const STATUTS_DATA = [
  { id: 1, name: 'Alice', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', active: true },
  { id: 2, name: 'Thomas', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', active: true },
  { id: 3, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80', active: false },
  { id: 4, name: 'Marc', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', active: true },
  { id: 5, name: 'Julie', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80', active: false },
];

const StatusRow = () => {
  return (
    <div className="d-flex gap-3 px-3 py-3 bg-white border-bottom border-light overflow-x-auto scrollbar-none">
      {/* Create your own status */}
      <div className="d-flex flex-column align-items-center gap-1 flex-shrink-0 cursor-pointer" style={{ width: '56px' }}>
        <div className="position-relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="My Status"
            className="rounded-circle object-fit-cover border border-secondary-subtle"
            style={{ width: '48px', height: '48px' }}
          />
          <span 
            className="position-absolute bottom-0 end-0 rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
            style={{ 
              width: '18px', 
              height: '18px', 
              backgroundColor: '#D85A30', 
              border: '2px solid #ffffff',
              fontSize: '11px',
              lineHeight: '1',
              transform: 'translate(5%, 5%)'
            }}
          >
            +
          </span>
        </div>
        <span className="text-secondary text-center" style={{ fontSize: '11px', fontWeight: '500' }}>Créer</span>
      </div>

      {/* Other statuses */}
      {STATUTS_DATA.map((status) => (
        <div key={status.id} className="d-flex flex-column align-items-center gap-1 flex-shrink-0 cursor-pointer" style={{ width: '56px' }}>
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ 
              width: '48px', 
              height: '48px',
              padding: '2px',
              border: status.active ? '2px solid #D85A30' : '1px solid #e0e0e0'
            }}
          >
            <img
              src={status.avatar}
              alt={status.name}
              className="rounded-circle object-fit-cover w-100 h-100"
            />
          </div>
          <span 
            className="text-secondary text-center text-truncate w-100" 
            style={{ fontSize: '11px', fontWeight: '500' }}
          >
            {status.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatusRow;
