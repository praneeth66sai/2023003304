import React, { useState } from 'react';
import { useCampusFeed } from '../hooks/useCampusFeed';
import './FeedStyle.css';

export default function FeedDisplay() {
  const { 
    bulletinList, loadingData, chosenType, 
    setChosenType, displaySize, setDisplaySize 
  } = useCampusFeed(10);

  const [clearedSet, setClearedSet] = useState(new Set());

  const executeClearAction = (id) => {
    setClearedSet(prev => new Set([...prev, id]));
  };

  return (
    <div className="bulletin-panel">
      <header className="bulletin-header">
        <h2 style={{ margin: 0, fontSize: '1.75rem', color: '#0f172a' }}>Notification Terminal</h2>
        <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Stage 2 - Active Streams</p>
      </header>

      <div className="filter-bar">
        <select 
          className="custom-select-menu" 
          value={chosenType} 
          onChange={(e) => setChosenType(e.target.value)}
        >
          <option value="">All Streams</option>
          <option value="Event">Events</option>
          <option value="Result">Results</option>
          <option value="Placement">Placements</option>
        </select>

        <select 
          className="custom-select-menu" 
          value={displaySize} 
          onChange={(e) => setDisplaySize(Number(e.target.value))}
        >
          <option value={5}>Display Limit: 5</option>
          <option value={10}>Display Limit: 10</option>
          <option value={20}>Display Limit: 20</option>
        </select>
      </div>

      <main>
        {loadingData ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '0.95rem' }}>Syncing telemetry datastream...</p>
        ) : (
          bulletinList.map((element) => {
            const isFresh = !clearedSet.has(element.ID);
            return (
              <div key={element.ID} className={`bulletin-card ${isFresh ? 'unread-status' : ''}`}>
                <div>
                  <div className="tag-row">
                    <span className="category-label">{element.Type}</span>
                    {isFresh && <span className="new-indicator">NEW</span>}
                  </div>
                  <p style={{ margin: 0, color: isFresh ? '#1e293b' : '#64748b', fontSize: '1rem', fontWeight: isFresh ? '500' : '400' }}>
                    {element.Message}
                  </p>
                  <small style={{ color: '#94a3b8', display: 'block', marginTop: '6px' }}>{element.Timestamp}</small>
                </div>

                {isFresh && (
                  <button className="action-ack-button" onClick={() => executeClearAction(element.ID)}>
                    Acknowledge
                  </button>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
