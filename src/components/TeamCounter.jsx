import React from 'react';
import { useTeam } from '../context/TeamContext';

const TeamCounter = ({ team1, team2, team1Image, team2Image, team1Name, team2Name }) => {
  const { selectedTeam } = useTeam();

  const getPlayerCount = (teamName) => {
    return selectedTeam.filter(player => {
      const playerTeam = player.team || player.team_name;
      return playerTeam === teamName;
    }).length;
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const count1 = getPlayerCount(team1Name);
  const count2 = getPlayerCount(team2Name);

  return (
    <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
      <div className="team-counter-item">
        <div className="team-circle position-relative">
          {team1Image ? (
            <img src={team1Image} alt={team1Name} className="team-circle-img" />
          ) : (
            <div className="team-circle-initials">{getInitials(team1Name)}</div>
          )}
          <span className="team-count-badge">{count1}</span>
        </div>
        <div className="team-name-small mt-1">{team1Name || team1}</div>
      </div>
      <div className="text-muted">VS</div>
      <div className="team-counter-item">
        <div className="team-circle position-relative">
          {team2Image ? (
            <img src={team2Image} alt={team2Name} className="team-circle-img" />
          ) : (
            <div className="team-circle-initials">{getInitials(team2Name)}</div>
          )}
          <span className="team-count-badge">{count2}</span>
        </div>
        <div className="team-name-small mt-1">{team2Name || team2}</div>
      </div>
    </div>
  );
};

export default TeamCounter;

