import React from 'react';
import { useTeam } from '../context/TeamContext';
import { TEAM_RULES } from '../utils/rules';
import { getTeamStats } from '../utils/validations';
import { MdClose } from 'react-icons/md';

const SelectedSidebar = () => {
  const { selectedTeam, removePlayer, isPlayerSelected } = useTeam();
  const stats = getTeamStats(selectedTeam);

  const getRoleCount = (role) => {
    return selectedTeam.filter(p => p.role === role).length;
  };

  const getPlayerCredits = (player) => {
    return player.credits || player.event_player_credit || 0;
  };

  const getPlayerTeam = (player) => {
    return player.team || player.team_name || 'N/A';
  };

  return (
    <div className="card sticky-top" style={{ top: '20px' }}>
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Selected Team</h5>
      </div>
      <div className="card-body">
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="text-center p-2 bg-primary text-white rounded">
              <div className="h4 mb-0">{stats.totalPlayers}/{TEAM_RULES.TOTAL_PLAYERS}</div>
              <small>Players</small>
            </div>
          </div>
          <div className="col-6">
            <div className="text-center p-2 bg-info text-white rounded">
              <div className="h4 mb-0">{stats.totalCredits.toFixed(1)}/{TEAM_RULES.TOTAL_CREDITS}</div>
              <small>Credits</small>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <h6>Role Breakdown</h6>
          <div className="list-group list-group-flush">
            <div className="list-group-item d-flex justify-content-between px-0">
              <span>Batsmen:</span>
              <strong>{getRoleCount('Batsman')}</strong>
            </div>
            <div className="list-group-item d-flex justify-content-between px-0">
              <span>Bowlers:</span>
              <strong>{getRoleCount('Bowler')}</strong>
            </div>
            <div className="list-group-item d-flex justify-content-between px-0">
              <span>All-Rounders:</span>
              <strong>{getRoleCount('All-Rounder')}</strong>
            </div>
            <div className="list-group-item d-flex justify-content-between px-0">
              <span>Wicket-Keepers:</span>
              <strong>{getRoleCount('Wicket-Keeper')}</strong>
            </div>
          </div>
        </div>

        <div>
          <h6>Selected Players</h6>
          {selectedTeam.length === 0 ? (
            <p className="text-muted text-center small">No players selected</p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="custom-scrollbar-hide">
              {selectedTeam.map(player => {
                const isSelected = isPlayerSelected(player.id);
                return (
                <div key={player.id} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                  <div className="flex-grow-1">
                    <div className="fw-bold small">{player.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {player.role} • {getPlayerTeam(player)} • {getPlayerCredits(player)} Cr
                    </div>
                  </div>
                    {isSelected && (
                  <button
                    className="btn btn-outline-danger btn-sm ms-2"
                    aria-label="Remove"
                    title="Remove from selected"
                    onClick={() => removePlayer(player.id)}
                  >
                        <MdClose />
                  </button>
                    )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedSidebar;
