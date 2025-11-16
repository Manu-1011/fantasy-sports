import React, { useMemo } from 'react';
import { useTeam } from '../context/TeamContext';
import { canAddPlayer } from '../utils/rules';
import Filters from './Filters';

const PlayerList = ({ players }) => {
  const { selectedTeam, addPlayer, isPlayerSelected, removePlayer } = useTeam();
  const [filters, setFilters] = React.useState({
    role: 'All',
    team: 'All',
    sortBy: 'points'
  });

  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = [...players];

    if (filters.role !== 'All') {
      filtered = filtered.filter(p => p.role === filters.role);
    }

    if (filters.team !== 'All') {
      filtered = filtered.filter(p => {
        const playerTeam = p.team || p.team_name;
        return playerTeam === filters.team;
      });
    }

    filtered.sort((a, b) => {
      if (filters.sortBy === 'points') {
        const aPoints = a.points || a.event_total_points || 0;
        const bPoints = b.points || b.event_total_points || 0;
        return bPoints - aPoints;
      } else if (filters.sortBy === 'credits') {
        const aCredits = a.credits || a.event_player_credit || 0;
        const bCredits = b.credits || b.event_player_credit || 0;
        return bCredits - aCredits;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [players, filters]);

  return (
    <div>
      <Filters filters={filters} onFilterChange={setFilters} players={players} />
      {filteredAndSortedPlayers.length === 0 ? (
        <div className="alert alert-info text-center">No players found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>Logo</th>
                <th>Name</th>
                <th>Role</th>
                <th>Team</th>
                <th>Points</th>
                <th>Credits</th>
                <th style={{ width: '120px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPlayers.map(player => {
                const selected = isPlayerSelected(player.id);
                const validation = canAddPlayer(selectedTeam, player);
                return (
                  <tr key={player.id} className={selected ? 'table-primary' : ''}>
                    <td>
                      {player.team_logo && (
                        <img src={player.team_logo} alt={player.team || player.team_name} className="team-logo-small" />
                      )}
                    </td>
                    <td>{player.name}</td>
                    <td>{player.role}</td>
                    <td>{player.team || player.team_name}</td>
                    <td>{player.points || player.event_total_points || 0}</td>
                    <td>{player.credits || player.event_player_credit || 0}</td>
                    <td>
                      {selected ? (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Deselect player"
                          onClick={() => removePlayer(player.id)}
                        >
                          Deselect
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={!validation.canAdd}
                          title={!validation.canAdd ? validation.reason : 'Select player'}
                          onClick={() => {
                            if (validation.canAdd) addPlayer(player);
                          }}
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlayerList;
