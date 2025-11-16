import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { getAllSavedTeams, updateTeamCaptains, getMatches } from '../api/teams';

const Summary = () => {
  const navigate = useNavigate();
  const { selectedSport } = useTeam();
  const [teamsByMatch, setTeamsByMatch] = useState({});
  const [matches, setMatches] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  useEffect(() => {
    const all = getAllSavedTeams();
    setTeamsByMatch(all);
    // ====== load matches =====
    getMatches().then(setMatches).catch(() => setMatches([]));
  }, []);

  const toggleTeam = (teamId) => {
    if (selectedTeamId === teamId) {
      setSelectedTeamId(null);
    } else {
      setSelectedTeamId(teamId);
    }
  };

  const getPlayerTeam = (player) => {
    return player?.team || player?.team_name || 'N/A';
  };

  const getMatchInfo = (matchId) => {
    const idNum = Number.parseInt(matchId, 10);
    return matches.find(m => Number.parseInt(m.id, 10) === idNum);
  };

  const handleSaveCaptains = async (teamId, captainId, viceCaptainId) => {
    if (!captainId || !viceCaptainId) {
      alert('Please select both Captain and Vice-Captain before saving');
      return;
    }
    setSaving(true);
    const result = updateTeamCaptains(teamId, { captainId, viceCaptainId });
    if (result && result.success) {
      const all = getAllSavedTeams();
      setTeamsByMatch(all);
      alert('Captains updated successfully');
    } else {
      alert('Failed to update captains');
    }
    setSaving(false);
  };

  const TeamEditCard = ({ team }) => {
    const players = Array.isArray(team.players) ? team.players : [];
    const [localCaptain, setLocalCaptain] = useState(team.captainId || null);
    const [localVC, setLocalVC] = useState(team.viceCaptainId || null);

    return (
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <strong>{team.name}</strong> • {new Date(team.createdAt).toLocaleString()}
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <select
              className="form-select form-select-sm"
              value={localCaptain || ''}
              onChange={(e) => setLocalCaptain(Number(e.target.value))}
            >
              <option value="">Select Captain</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select
              className="form-select form-select-sm"
              value={localVC || ''}
              onChange={(e) => setLocalVC(Number(e.target.value))}
            >
              <option value="">Select Vice-Captain</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => handleSaveCaptains(team.id, localCaptain, localVC)} 
              disabled={saving || !localCaptain || !localVC}
              title={!localCaptain || !localVC ? 'Please select both Captain and Vice-Captain' : 'Save selections'}
            >
              Save C/VC
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-sm table-striped align-middle">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Team</th>
                  <th>Points</th>
                  <th>Credits</th>
                  <th>Captain/VC</th>
                </tr>
              </thead>
              <tbody>
                {players.map(player => (
                  <tr key={player.id} className={localCaptain === player.id ? 'table-warning' : localVC === player.id ? 'table-info' : ''}>
                    <td>
                      {player.team_logo && (
                        <img src={player.team_logo} alt={getPlayerTeam(player)} className="team-logo-small" />
                      )}
                    </td>
                    <td>{player.name}</td>
                    <td>{player.role}</td>
                    <td>{player.team || player.team_name}</td>
                    <td>{player.points || player.event_total_points || 0}</td>
                    <td>{player.credits || player.event_player_credit || 0}</td>
                    <td>
                      {localCaptain === player.id && <span className="badge bg-warning text-dark">C</span>}
                      {localVC === player.id && <span className="badge bg-info text-dark">VC</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const getAllTeams = () => {
    const allTeams = [];
    Object.keys(teamsByMatch).forEach(matchId => {
      if (Array.isArray(teamsByMatch[matchId])) {
        teamsByMatch[matchId].forEach(team => {
          allTeams.push({ ...team, matchId });
        });
      }
    });
    return allTeams;
  };

  const matchIds = Object.keys(teamsByMatch);
  const allTeams = getAllTeams();

  if (matchIds.length === 0 || allTeams.length === 0) {
    return (
      <div className="container-fluid mt-4 px-3 px-md-4">
        <h1>My Teams</h1>
        <div className="alert alert-info">
          No teams found. Create a team to get started.
        </div>
        <Link to="/" className="btn btn-primary">Select Match & Create Team</Link>
      </div>
    );
  }

  // ====== show all teams list =====
  if (selectedTeamId === null) {
    return (
      <div className="container-fluid mt-4 px-3 px-md-4">
        <h1>My Teams</h1>
        <div className="small text-muted mb-3">
          Sport: {selectedSport ? selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1) : 'Cricket'}
        </div>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Match</th>
                <th>Created</th>
                <th>Captain</th>
                <th>Vice-Captain</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTeams.map(team => {
                const matchInfo = getMatchInfo(team.matchId);
                const players = Array.isArray(team.players) ? team.players : [];
                const captainPlayer = players.find(p => p.id === team.captainId);
                const vcPlayer = players.find(p => p.id === team.viceCaptainId);
                
                return (
                  <tr key={team.id}>
                    <td><strong>{team.name}</strong></td>
                    <td>
                      {matchInfo && (
                        <div className="d-flex align-items-center gap-1">
                          {matchInfo.t1_image && <img src={matchInfo.t1_image} alt={matchInfo.t1_name} className="team-logo-small" />}
                          <span>{matchInfo.t1_short_name || matchInfo.t1_name}</span>
                          <span className="text-muted">VS</span>
                          {matchInfo.t2_image && <img src={matchInfo.t2_image} alt={matchInfo.t2_name} className="team-logo-small" />}
                          <span>{matchInfo.t2_short_name || matchInfo.t2_name}</span>
                        </div>
                      )}
                    </td>
                    <td>{new Date(team.createdAt).toLocaleString()}</td>
                    <td>{captainPlayer ? captainPlayer.name : 'Not Set'}</td>
                    <td>{vcPlayer ? vcPlayer.name : 'Not Set'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => toggleTeam(team.id)}
                      >
                        View/Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ====== show team edit view =====
  const selectedTeam = allTeams.find(t => t.id === selectedTeamId);
  if (!selectedTeam) {
    return (
      <div className="container-fluid mt-4 px-3 px-md-4">
        <h1>My Teams</h1>
        <button className="btn btn-secondary mb-3" onClick={() => setSelectedTeamId(null)}>Back to List</button>
        <div className="alert alert-danger">Team not found</div>
      </div>
    );
  }

  const matchInfo = getMatchInfo(selectedTeam.matchId);

  return (
    <div className="container-fluid mt-4 px-3 px-md-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Edit Team: {selectedTeam.name}</h1>
        <button className="btn btn-secondary" onClick={() => setSelectedTeamId(null)}>Back to List</button>
      </div>

      {matchInfo && (
        <div className="mb-3 p-3 bg-light rounded">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              {matchInfo.t1_image && <img src={matchInfo.t1_image} alt={matchInfo.t1_name} className="team-logo-small" />}
              <strong>{matchInfo.t1_name || matchInfo.t1_short_name}</strong>
              <span className="text-muted">VS</span>
              {matchInfo.t2_image && <img src={matchInfo.t2_image} alt={matchInfo.t2_name} className="team-logo-small" />}
              <strong>{matchInfo.t2_name || matchInfo.t2_short_name}</strong>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">
                {matchInfo.match_date ? new Date(matchInfo.match_date).toLocaleString() : ''}
              </span>
              <Link to={`/create-team?match=${matchInfo.id}&sport=${selectedSport || 'cricket'}`} className="btn btn-primary btn-sm">
                Make Team
              </Link>
            </div>
          </div>
        </div>
      )}

      <TeamEditCard team={selectedTeam} />
    </div>
  );
};

export default Summary;
