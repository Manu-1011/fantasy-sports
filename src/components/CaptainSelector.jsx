import React from 'react';
import { useTeam } from '../context/TeamContext';

const CaptainSelector = () => {
  const { selectedTeam, captain, viceCaptain, setCaptain, setViceCaptain, teamName, setTeamName } = useTeam();

  const handleCaptainSelect = (playerId) => {
    if (viceCaptain === playerId) {
      setViceCaptain(null);
    }
    setCaptain(playerId);
  };

  const handleViceCaptainSelect = (playerId) => {
    if (captain === playerId) {
      setCaptain(null);
    }
    setViceCaptain(playerId);
  };

  const getPlayerTeam = (player) => {
    return player.team || player.team_name || 'N/A';
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-warning">
        <h5 className="mb-0">Select Captain & Vice-Captain</h5>
        <small className="text-muted">Captain gets 2x points, Vice-Captain gets 1.5x points</small>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="teamNameInput" className="form-label">Team Name (required)</label>
          <input
            id="teamNameInput"
            type="text"
            className="form-control"
            placeholder="Enter a unique team name"
            value={teamName || ''}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <div className="row g-3">
          {selectedTeam.map(player => (
            <div key={player.id} className="col-md-6 col-lg-4">
              <div className={`card h-100 ${captain === player.id ? 'border-warning border-3' : ''} ${viceCaptain === player.id ? 'border-info border-3' : ''}`}>
                <div className="card-body">
                  <h6 className="card-title">{player.name}</h6>
                  <p className="card-text small text-muted mb-2">
                    {player.role} • {getPlayerTeam(player)}
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      className={`btn btn-sm ${captain === player.id ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => handleCaptainSelect(player.id)}
                      disabled={captain === player.id}
                    >
                      {captain === player.id ? 'Captain' : 'Make Captain'}
                    </button>
                    <button
                      className={`btn btn-sm ${viceCaptain === player.id ? 'btn-info' : 'btn-outline-info'}`}
                      onClick={() => handleViceCaptainSelect(player.id)}
                      disabled={viceCaptain === player.id}
                    >
                      {viceCaptain === player.id ? 'VC' : 'Make VC'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaptainSelector;

