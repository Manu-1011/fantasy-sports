import { isTeamValid, getTotalCredits, TEAM_RULES } from './rules';

export const validateTeam = (team) => {
  return isTeamValid(team);
};

export const validatePlayerSelection = (team, player) => {
  const errors = [];

  if (team.length >= TEAM_RULES.TOTAL_PLAYERS) {
    errors.push('Team is full');
  }

  if (team.some(p => p.id === player.id)) {
    errors.push('Player already selected');
  }

  const totalCredits = getTotalCredits(team);
  const playerCredits = player.credits || player.event_player_credit || 0;
  if (totalCredits + playerCredits > TEAM_RULES.TOTAL_CREDITS) {
    errors.push('Insufficient credits');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getTeamStats = (team) => {
  const stats = {
    totalPlayers: team.length,
    totalCredits: getTotalCredits(team),
    remainingCredits: TEAM_RULES.TOTAL_CREDITS - getTotalCredits(team),
    batsmen: team.filter(p => p.role === 'Batsman').length,
    bowlers: team.filter(p => p.role === 'Bowler').length,
    allRounders: team.filter(p => p.role === 'All-Rounder').length,
    wicketKeepers: team.filter(p => p.role === 'Wicket-Keeper').length
  };

  return stats;
};
