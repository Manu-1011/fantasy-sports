import { apiClient } from './client';

// ====== sanitize url =====
const sanitizeUrl = (url) => (typeof url === 'string' ? url.replace(/`/g, '').trim() : url);

// ====== get all matches =====
export const getMatches = async () => {
  try {
    const data = await apiClient.get('Get_All_upcoming_Matches.json');
    if (data && data.matches && data.matches.cricket && Array.isArray(data.matches.cricket)) {
      return data.matches.cricket.map(m => ({
        ...m,
        t1_image: sanitizeUrl(m.t1_image),
        t2_image: sanitizeUrl(m.t2_image)
      }));
    }
  } catch (error) {
    console.error('Error fetching matches from API:', error);
  }
  return [];
};

// ====== get match by id =====
export const getMatchById = async (matchId) => {
  const matches = await getMatches();
  const idNum = Number.parseInt(matchId, 10);
  return matches.find(m => m.id === idNum || String(m.id) === String(matchId));
};

// ====== save team =====
export const saveTeam = async (teamData) => {
  try {
    const existing = localStorage.getItem('fantasyTeams');
    const allTeams = existing ? JSON.parse(existing) : {};
    const matchId = teamData.matchId;
    if (!allTeams[matchId]) {
      allTeams[matchId] = [];
    }
    const newEntry = { id: Date.now(), ...teamData };
    allTeams[matchId].push(newEntry);
    localStorage.setItem('fantasyTeams', JSON.stringify(allTeams));
    return { success: true, data: newEntry };
  } catch (error) {
    console.error('Error saving team:', error);
    return { success: false, error };
  }
};

// ====== get saved teams by match =====
export const getSavedTeams = (matchId) => {
  try {
    const existing = localStorage.getItem('fantasyTeams');
    const allTeams = existing ? JSON.parse(existing) : {};
    return matchId && allTeams[matchId] ? allTeams[matchId] : [];
  } catch (error) {
    console.error('Error getting saved teams:', error);
    return [];
  }
};

// ====== get last saved team =====
export const getSavedTeam = () => {
  try {
    const existing = localStorage.getItem('fantasyTeams');
    if (!existing) return null;
    const allTeams = JSON.parse(existing);
    const allLists = Object.values(allTeams).filter(Array.isArray);
    if (allLists.length === 0) return null;
    const flat = allLists.flat();
    return flat.sort((a,b) => b.id - a.id)[0] || null;
  } catch (error) {
    console.error('Error getting saved team:', error);
    return null;
  }
};

// ====== get all saved teams =====
export const getAllSavedTeams = () => {
  try {
    const existing = localStorage.getItem('fantasyTeams');
    return existing ? JSON.parse(existing) : {};
  } catch (error) {
    console.error('Error loading all saved teams:', error);
    return {};
  }
};

// ====== update team captains =====
export const updateTeamCaptains = (teamId, { captainId, viceCaptainId }) => {
  try {
    const existing = localStorage.getItem('fantasyTeams');
    const allTeams = existing ? JSON.parse(existing) : {};
    let updated = false;

    Object.keys(allTeams).forEach(matchId => {
      const teams = allTeams[matchId];
      if (Array.isArray(teams)) {
        const index = teams.findIndex(t => t.id === teamId);
        if (index >= 0) {
          teams[index] = {
            ...teams[index],
            captainId,
            viceCaptainId
          };
          updated = true;
        }
      }
    });

    if (updated) {
      localStorage.setItem('fantasyTeams', JSON.stringify(allTeams));
      return { success: true };
    }
    return { success: false, error: 'Team not found' };
  } catch (error) {
    console.error('Error updating team captains:', error);
    return { success: false, error };
  }
};
