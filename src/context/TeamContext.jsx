import React, { createContext, useState, useContext } from 'react';

const TeamContext = createContext();

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within TeamProvider');
  }
  return context;
};

export const TeamProvider = ({ children }) => {
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedSport, setSelectedSport] = useState('all');
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [teamName, setTeamName] = useState('');

  // ====== add player =====
  const addPlayer = (player) => {
    setSelectedTeam(prev => [...prev, player]);
  };

  // ====== remove player =====
  const removePlayer = (playerId) => {
    setSelectedTeam(prev => prev.filter(p => p.id !== playerId));
  };

  const clearTeam = () => {
    setSelectedTeam([]);
    setCaptain(null);
    setViceCaptain(null);
    setTeamName('');
  };

  const isPlayerSelected = (playerId) => {
    return selectedTeam.some(p => p.id === playerId);
  };

  return (
    <TeamContext.Provider
      value={{
        selectedTeam,
        selectedMatch,
        selectedSport,
        captain,
        viceCaptain,
        teamName,
        setSelectedMatch,
        setSelectedSport,
        setCaptain,
        setViceCaptain,
        setTeamName,
        addPlayer,
        clearTeam,
        isPlayerSelected,
        setSelectedTeam,
        removePlayer
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
