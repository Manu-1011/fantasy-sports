import React from 'react';
import { useTeam } from '../context/TeamContext';
import { canAddPlayer } from '../utils/rules';

const PlayerCard = ({ player }) => {
  const { selectedTeam, addPlayer, isPlayerSelected } = useTeam();
  const selected = isPlayerSelected(player.id);
  const validation = canAddPlayer(selectedTeam, player);

  const handleClick = () => {
    if (selected) {
      return;
    } else if (validation.canAdd) {
      addPlayer(player);
    }
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      'Batsman': 'bg-success',
      'Bowler': 'bg-danger',
      'All-Rounder': 'bg-warning',
      'Wicket-Keeper': 'bg-info'
    };
    return classes[role] || 'bg-secondary';
  };

  return (
    <div 
      className={`card h-100 ${selected ? 'border-primary border-3' : ''} ${!validation.canAdd && !selected ? 'opacity-50' : ''}`}
      style={{ cursor: validation.canAdd && !selected ? 'pointer' : 'default' }}
      onClick={handleClick}
      title={!validation.canAdd && !selected ? validation.reason : ''}
    >
      <div className="card-body position-relative">
        {selected && (
          <span className="badge bg-primary position-absolute top-0 end-0 m-2">Selected</span>
        )}
        {player.team_logo && (
          <div className="text-center mb-2">
            <img src={player.team_logo} alt={player.team} style={{ width: '30px', height: '30px' }} />
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="card-title mb-0">{player.name}</h6>
          <span className={`badge ${getRoleBadgeClass(player.role)} text-white`}>
            {player.role}
          </span>
        </div>
        <p className="card-text text-muted small mb-2">{player.team || player.team_name}</p>
        {player.country && (
          <p className="card-text text-muted small mb-2">{player.country}</p>
        )}
        <div className="row g-2">
          <div className="col-6">
            <small className="text-muted d-block">Points</small>
            <strong>{player.points || player.event_total_points || 0}</strong>
          </div>
          <div className="col-6">
            <small className="text-muted d-block">Credits</small>
            <strong>{player.credits || player.event_player_credit || 0}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
