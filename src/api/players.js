import { apiClient } from './client';

// ====== sanitize url =====
const sanitizeUrl = (url) => (typeof url === 'string' ? url.replace(/`/g, '').trim() : url);

// ====== map player data =====
const mapPlayerData = (apiPlayer) => {
  return {
    id: apiPlayer.id,
    player_id: apiPlayer.player_id,
    name: apiPlayer.name,
    role: apiPlayer.role,
    country: apiPlayer.country,
    short_name: apiPlayer.short_name,
    team: apiPlayer.team_name,
    team_logo: sanitizeUrl(apiPlayer.team_logo),
    team_short_name: apiPlayer.team_short_name,
    team_id: apiPlayer.team_id,
    points: apiPlayer.event_total_points || 0,
    credits: apiPlayer.event_player_credit || 0,
    selectedBy: '0%',
    is_playing: apiPlayer.is_playing,
    player_stats_available: apiPlayer.player_stats_available
  };
};

// ====== get all players =====
export const getPlayers = async (matchId = null) => {
  try {
    const data = await apiClient.get('Get_All_Players_of_match.json');
    if (data && Array.isArray(data)) {
      return data.map(mapPlayerData);
    }
  } catch (error) {
    console.error('Error fetching players from API:', error);
  }
  return [];
};

// ====== get player by id =====
export const getPlayerById = async (playerId) => {
  const players = await getPlayers();
  return players.find(p => p.id === playerId);
};
