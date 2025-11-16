import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { getMatches } from '../api/teams';
import SportSelector from '../components/SportSelector';
import PromotionalRibbon from '../components/PromotionalRibbon';
import CountdownTimer from '../components/CountdownTimer';

function Home() {
  const { selectedSport, setSelectedSport } = useTeam();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('matches');

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMatches();
        if (data && Array.isArray(data)) {
        const filteredMatches = selectedSport === 'all' 
          ? data 
          : data.filter(match => 
            !match.sport_type || match.sport_type === selectedSport || selectedSport === 'cricket'
          );
          setMatches(filteredMatches);
        } else {
          setMatches([]);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError('Failed to load matches. Please try again later.');
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [selectedSport]);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const isCompleted = (match) => {
    if (!match || !match.match_date) return false;
    try {
      const now = Date.now();
      const matchTime = new Date(match.match_date).getTime();
      return now >= matchTime;
    } catch {
      return false;
    }
  };

  const getJoinedMatchIds = () => {
    try {
      const existing = localStorage.getItem('fantasyTeams');
      if (!existing) return new Set();
      const allTeams = JSON.parse(existing);
      const joinedIds = Object.keys(allTeams).filter(k => Array.isArray(allTeams[k]) && allTeams[k].length > 0);
      return new Set(joinedIds.map(id => Number.parseInt(id, 10)));
    } catch {
      return new Set();
    }
  };

  const joinedIds = getJoinedMatchIds();
  const upcomingMatches = matches.filter(m => !isCompleted(m));
  const joinedMatches = matches.filter(m => joinedIds.has(Number(m.id)));
  const completedMatches = matches.filter(m => isCompleted(m));

  if (loading) {
    return (
      <div className="container-fluid mt-5 px-3 px-md-4">
        <SportSelector selectedSport={selectedSport} onSportSelect={setSelectedSport} />
        <PromotionalRibbon />
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading matches...</span>
          </div>
          <p className="mt-3 text-muted">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid mt-5 px-3 px-md-4">
        <SportSelector selectedSport={selectedSport} onSportSelect={setSelectedSport} />
        <PromotionalRibbon />
        <div className="alert alert-danger mt-4" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 px-3 px-md-4">
      <SportSelector selectedSport={selectedSport} onSportSelect={setSelectedSport} />
      <PromotionalRibbon />

      <div className="mt-4">
        <div className="d-flex gap-2 mb-4 flex-wrap">
          <button 
            className={`btn ${activeTab === 'matches' ? 'btn-primary' : 'btn-outline-primary'}`} 
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </button>
          <button 
            className={`btn ${activeTab === 'joined' ? 'btn-primary' : 'btn-outline-primary'}`} 
            onClick={() => setActiveTab('joined')}
          >
            Joined
          </button>
          <button 
            className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`} 
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>

        <h2 className="mb-4">
          {activeTab === 'matches' && `Upcoming Matches${selectedSport !== 'all' ? ` - ${selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)}` : ''}`}
          {activeTab === 'joined' && 'Joined Matches'}
          {activeTab === 'completed' && 'Completed Matches'}
        </h2>
        
        {activeTab === 'matches' && (
          <>
            {Array.isArray(upcomingMatches) && upcomingMatches.length > 0 ? (
              <div className="list-group">
                {upcomingMatches.map(match => (
                  <div key={match.id} className="list-group-item list-group-item-action match-card">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          {match.t1_image && (
                            <img src={match.t1_image} alt={match.t1_name} className="team-logo-small" />
                          )}
                          <h5 className="mb-0">{match.t1_name || match.t1_short_name}</h5>
                          <span className="text-muted">VS</span>
                          {match.t2_image && (
                            <img src={match.t2_image} alt={match.t2_name} className="team-logo-small" />
                          )}
                          <h5 className="mb-0">{match.t2_name || match.t2_short_name}</h5>
                        </div>
                        <div className="d-flex flex-wrap gap-3 text-muted small">
                          <span>Date: {formatDate(match.match_date)}</span>
                          <span>Time: {formatTime(match.match_date)}</span>
                          {match.match_type && <span>Match Type: {match.match_type}</span>}
                          {match.event_name && <span>Event: {match.event_name}</span>}
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-2 align-items-md-end">
                        <Link to={`/create-team?match=${match.id}&sport=${selectedSport}`} className="btn btn-primary">Make Team</Link>
                        <div className="text-center">
                          <CountdownTimer matchDate={match.match_date} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info text-center">
                <h5>No Upcoming Matches</h5>
                <p className="mb-0">
                  {selectedSport === 'all' 
                    ? 'No matches scheduled at the moment. Please check back later!'
                    : `No ${selectedSport} matches scheduled at the moment. Please check back later!`
                  }
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'joined' && (
          <>
            {Array.isArray(joinedMatches) && joinedMatches.length > 0 ? (
              <div className="list-group">
                {joinedMatches.map(match => {
                  const matchCompleted = isCompleted(match);
                  return (
                    <div key={match.id} className="list-group-item match-card">
                      <div className="d-flex align-items-center gap-2">
                        {match.t1_image && <img src={match.t1_image} alt={match.t1_name} className="team-logo-small" />}
                        <strong>{match.t1_name || match.t1_short_name}</strong>
                        <span className="text-muted">VS</span>
                        {match.t2_image && <img src={match.t2_image} alt={match.t2_name} className="team-logo-small" />}
                        <strong>{match.t2_name || match.t2_short_name}</strong>
                        {matchCompleted && (
                          <span className="badge bg-danger ms-2">Completed</span>
                        )}
                        <span className="ms-auto text-muted small">Date: {formatDate(match.match_date)}, Time: {formatTime(match.match_date)}</span>
                      </div>
                      <div className="mt-2">
                        {!matchCompleted ? (
                          <Link to={`/create-team?match=${match.id}&sport=${selectedSport}`} className="btn btn-outline-primary btn-sm">Create Another Team</Link>
                        ) : (
                          <Link to={`/summary`} className="btn btn-outline-primary btn-sm">View My Teams</Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="alert alert-info text-center">No joined matches found.</div>
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {Array.isArray(completedMatches) && completedMatches.length > 0 ? (
              <div className="list-group">
                {completedMatches.map(match => {
                  const hasTeam = joinedIds.has(Number(match.id));
                  return (
                    <div key={match.id} className="list-group-item match-card">
                      <div className="d-flex align-items-center gap-2">
                        {match.t1_image && <img src={match.t1_image} alt={match.t1_name} className="team-logo-small" />}
                        <strong>{match.t1_name || match.t1_short_name}</strong>
                        <span className="text-muted">VS</span>
                        {match.t2_image && <img src={match.t2_image} alt={match.t2_name} className="team-logo-small" />}
                        <strong>{match.t2_name || match.t2_short_name}</strong>
                        {hasTeam && (
                          <span className="badge bg-success ms-2">You have teams</span>
                        )}
                        <span className="ms-auto text-muted small">Date: {formatDate(match.match_date)}, Time: {formatTime(match.match_date)}</span>
                      </div>
                      {hasTeam && (
                        <div className="mt-2">
                          <Link to={`/summary`} className="btn btn-outline-primary btn-sm">View My Teams</Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="alert alert-info text-center">No completed matches yet.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
