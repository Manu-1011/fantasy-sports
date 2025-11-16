import React from 'react';

const SportSelector = ({ selectedSport, onSportSelect }) => {
  const sports = [
    { id: 'all', name: 'All', icon: '' },
    { id: 'cricket', name: 'Cricket', icon: '🏏' },
    { id: 'football', name: 'Football', icon: '⚽' },
    { id: 'basketball', name: 'Basketball', icon: '🏀' },
    { id: 'rugby', name: 'Rugby', icon: '🏉' },
    { id: 'tennis', name: 'Tennis', icon: '🎾' },
    { id: 'hockey', name: 'Hockey', icon: '🏑' },
    { id: 'baseball', name: 'Baseball', icon: '⚾' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
    { id: 'badminton', name: 'Badminton', icon: '' },
    { id: 'table-tennis', name: 'Table Tennis', icon: '' },
    { id: 'golf', name: 'Golf', icon: '' },
    { id: 'swimming', name: 'Swimming', icon: '' },
    { id: 'boxing', name: 'Boxing', icon: '' },
    { id: 'wrestling', name: 'Wrestling', icon: '' }
  ];

  return (
    <div className="sport-selector-container mb-4">
      <div className="sport-selector-scroll">
        {sports.map(sport => (
          <button
            key={sport.id}
            className={`sport-button ${selectedSport === sport.id ? 'active' : ''}`}
            onClick={() => onSportSelect(sport.id)}
            title={sport.name}
          >
            <div className="sport-name">{sport.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SportSelector;

