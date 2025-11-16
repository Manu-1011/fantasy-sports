import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { getPlayers } from '../api/players';
import { getMatchById, saveTeam } from '../api/teams';
import PlayerList from '../components/PlayerList';
import SelectedSidebar from '../components/SelectedSidebar';
import Tabs from '../components/Tabs';
import CaptainSelector from '../components/CaptainSelector';
import TeamCounter from '../components/TeamCounter';
import CountdownTimer from '../components/CountdownTimer';
import { validateTeam } from '../utils/validations';

const CreateTeam = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedTeam, setSelectedMatch, setSelectedSport, selectedSport, captain, viceCaptain, teamName } = useTeam();
  const [players, setPlayers] = useState([]);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showCaptainSelector, setShowCaptainSelector] = useState(false);

  useEffect(() => {
    // ====== check match id and redirect =====
    const matchId = searchParams.get('match');
    const sport = searchParams.get('sport');
    
    if (!matchId) {
      navigate('/');
      return;
    }

    if (matchId) {
      setSelectedMatch(parseInt(matchId));
    }
    if (sport) {
      setSelectedSport(sport);
    }

    // ====== fetch match and players data =====
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (matchId) {
          const matchData = await getMatchById(matchId);
          setMatch(matchData);
        }

        const data = await getPlayers(matchId);
        if (data && Array.isArray(data)) {
          setPlayers(data);
        } else {
          setPlayers([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, setSelectedMatch, setSelectedSport, navigate]);

  const tabs = [
    { id: 'all', label: 'All Players' },
    { id: 'batsman', label: 'Batsmen' },
    { id: 'bowler', label: 'Bowlers' },
    { id: 'all-rounder', label: 'All-Rounders' },
    { id: 'wicket-keeper', label: 'Wicket-Keepers' }
  ];

  const getFilteredPlayers = () => {
    if (activeTab === 'all') return players;
    const roleMap = {
      'batsman': 'Batsman',
      'bowler': 'Bowler',
      'all-rounder': 'All-Rounder',
      'wicket-keeper': 'Wicket-Keeper'
    };
    return players.filter(p => p.role === roleMap[activeTab]);
  };

  const isMatchLocked = () => {
    return false;
  };

  const handlePreviewTeam = () => {
    const validation = validateTeam(selectedTeam);
    if (validation.valid) {
      setShowCaptainSelector(true);
    } else {
      alert(validation.reason);
    }
  };

  const handleSaveTeam = async () => {
    const validation = validateTeam(selectedTeam);
    if (!validation.valid) {
      alert(validation.reason);
      return;
    }

    if (!captain || !viceCaptain) {
      alert('Please select both Captain and Vice-Captain');
      return;
    }

    if (!teamName || teamName.trim().length === 0) {
      alert('Please enter a team name before saving');
      return;
    }

    const matchId = searchParams.get('match');
    const payload = {
      name: teamName.trim(),
      matchId: matchId ? parseInt(matchId) : null,
      sport: selectedSport,
      captainId: captain,
      viceCaptainId: viceCaptain,
      players: selectedTeam,
      createdAt: new Date().toISOString()
    };

    const result = await saveTeam(payload);
    if (result && result.success) {
      navigate('/summary');
    } else {
      alert('Failed to save team. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-5 px-3 px-md-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading players...</span>
          </div>
          <p className="mt-3 text-muted">Loading players...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid mt-5 px-3 px-md-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="container-fluid mt-5 px-3 px-md-4">
        <div className="alert alert-info text-center">
          <h5>No Players Available</h5>
          <p className="mb-0">No players found for this match. Please try selecting a different match.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 px-3 px-md-4" style={{ paddingBottom: '100px' }}>
      <div className="text-center mb-4">
        <h1>Create Your Team</h1>
        <p className="lead">Select 11 players within 100 credits</p>
        {match && (
          <div className="small mt-2 d-flex flex-column align-items-center gap-1">
            <div>
              <strong>Time Left: </strong>
              <CountdownTimer matchDate={match.match_date} />
            </div>
          </div>
        )}
      </div>
      {!showCaptainSelector ? (
        <>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="row">
            <div className="col-lg-9 col-xl-10">
              <PlayerList players={getFilteredPlayers()} />
            </div>
            <div className="col-lg-3 col-xl-2">
              <SelectedSidebar />
            </div>
          </div>
          <div 
            className="sticky-bottom bg-white border-top p-3 shadow-sm"
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            <button
              className="btn btn-info btn-lg"
              onClick={handlePreviewTeam}
              disabled={selectedTeam.length !== 11}
              title={selectedTeam.length !== 11 ? 'Please select 11 players first' : 'Preview your team'}
            >
              Preview Team
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handlePreviewTeam}
              disabled={selectedTeam.length !== 11}
              title={selectedTeam.length !== 11 ? 'Please select 11 players first' : 'Save your team'}
            >
              Save Team
            </button>
          </div>
        </>
      ) : (
        <>
          <CaptainSelector />
          <div 
            className="sticky-bottom bg-white border-top p-3 shadow-sm"
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => setShowCaptainSelector(false)}
            >
              Back to Selection
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSaveTeam}
              disabled={!captain || !viceCaptain || !teamName || teamName.trim().length === 0}
              title={!captain || !viceCaptain ? 'Please select both Captain and Vice-Captain' : (!teamName || teamName.trim().length === 0 ? 'Please enter a team name' : 'Save your team')}
            >
              Save Team
            </button>
          </div>
        </>
      )}
      {match && (
        <TeamCounter
          team1={match.t1_short_name}
          team2={match.t2_short_name}
          team1Image={match.t1_image}
          team2Image={match.t2_image}
          team1Name={match.t1_name}
          team2Name={match.t2_name}
        />
      )}
    </div>
  );
};

export default CreateTeam;
