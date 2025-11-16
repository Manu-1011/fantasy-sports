import React from 'react';

const Filters = ({ filters, onFilterChange, players = [] }) => {
  const roles = ['All', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];
  
  // ====== get unique teams =====
  const getUniqueTeams = () => {
    const teams = new Set();
    players.forEach(player => {
      const teamName = player.team || player.team_name;
      if (teamName) {
        teams.add(teamName);
      }
    });
    return ['All', ...Array.from(teams).sort()];
  };

  const teams = getUniqueTeams();

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">Role:</label>
            <select 
              className="form-select"
              value={filters.role} 
              onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">Team:</label>
            <select 
              className="form-select"
              value={filters.team} 
              onChange={(e) => onFilterChange({ ...filters, team: e.target.value })}
            >
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">Sort By:</label>
            <select 
              className="form-select"
              value={filters.sortBy} 
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            >
              <option value="points">Points</option>
              <option value="credits">Credits</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
