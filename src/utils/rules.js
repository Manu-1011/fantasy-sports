// ====== team rules =====
export const TEAM_RULES = {
  TOTAL_PLAYERS: 11,
  MIN_BATSMEN: 3,
  MAX_BATSMEN: 6,
  MIN_BOWLERS: 3,
  MAX_BOWLERS: 6,
  MIN_ALL_ROUNDERS: 1,
  MAX_ALL_ROUNDERS: 4,
  MIN_WICKET_KEEPERS: 1,
  MAX_WICKET_KEEPERS: 4,
  MAX_PLAYERS_FROM_TEAM: 7,
  TOTAL_CREDITS: 100
};

export const getRoleCount = (team, role) => {
  return team.filter(player => player.role === role).length;
};

export const getTeamCount = (team, teamName) => {
  return team.filter(player => {
    const playerTeam = player.team || player.team_name;
    return playerTeam === teamName;
  }).length;
};

export const getTotalCredits = (team) => {
  return team.reduce((total, player) => {
    const credits = player.credits || player.event_player_credit || 0;
    return total + credits;
  }, 0);
};

// ====== check if player can be added =====
export const canAddPlayer = (team, player) => {
  if (team.length >= TEAM_RULES.TOTAL_PLAYERS) {
    return { canAdd: false, reason: 'Team is full (11 players required)' };
  }

  if (team.some(p => p.id === player.id)) {
    return { canAdd: false, reason: 'Player already selected' };
  }

  const totalCredits = getTotalCredits(team);
  const playerCredits = player.credits || player.event_player_credit || 0;
  if (totalCredits + playerCredits > TEAM_RULES.TOTAL_CREDITS) {
    return { canAdd: false, reason: 'Insufficient credits' };
  }

  const roleCount = getRoleCount(team, player.role);
  const roleMax = TEAM_RULES[`MAX_${player.role.toUpperCase().replace('-', '_')}S`] || 11;
  if (roleCount >= roleMax) {
    return { canAdd: false, reason: `Maximum ${roleMax} ${player.role}(s) allowed` };
  }

  const playerTeam = player.team || player.team_name;
  const teamCount = getTeamCount(team, playerTeam);
  if (teamCount >= TEAM_RULES.MAX_PLAYERS_FROM_TEAM) {
    return { canAdd: false, reason: `Maximum ${TEAM_RULES.MAX_PLAYERS_FROM_TEAM} players from same team` };
  }

  return { canAdd: true };
};

export const isTeamValid = (team) => {
  if (team.length !== TEAM_RULES.TOTAL_PLAYERS) {
    return { valid: false, reason: `Team must have exactly ${TEAM_RULES.TOTAL_PLAYERS} players` };
  }

  const batsmen = getRoleCount(team, 'Batsman');
  if (batsmen < TEAM_RULES.MIN_BATSMEN || batsmen > TEAM_RULES.MAX_BATSMEN) {
    return { valid: false, reason: `Team must have ${TEAM_RULES.MIN_BATSMEN}-${TEAM_RULES.MAX_BATSMEN} batsmen` };
  }

  const bowlers = getRoleCount(team, 'Bowler');
  if (bowlers < TEAM_RULES.MIN_BOWLERS || bowlers > TEAM_RULES.MAX_BOWLERS) {
    return { valid: false, reason: `Team must have ${TEAM_RULES.MIN_BOWLERS}-${TEAM_RULES.MAX_BOWLERS} bowlers` };
  }

  const allRounders = getRoleCount(team, 'All-Rounder');
  if (allRounders < TEAM_RULES.MIN_ALL_ROUNDERS || allRounders > TEAM_RULES.MAX_ALL_ROUNDERS) {
    return { valid: false, reason: `Team must have ${TEAM_RULES.MIN_ALL_ROUNDERS}-${TEAM_RULES.MAX_ALL_ROUNDERS} all-rounders` };
  }

  const wicketKeepers = getRoleCount(team, 'Wicket-Keeper');
  if (wicketKeepers < TEAM_RULES.MIN_WICKET_KEEPERS || wicketKeepers > TEAM_RULES.MAX_WICKET_KEEPERS) {
    return { valid: false, reason: `Team must have ${TEAM_RULES.MIN_WICKET_KEEPERS}-${TEAM_RULES.MAX_WICKET_KEEPERS} wicket-keepers` };
  }

  const totalCredits = getTotalCredits(team);
  if (totalCredits > TEAM_RULES.TOTAL_CREDITS) {
    return { valid: false, reason: `Total credits cannot exceed ${TEAM_RULES.TOTAL_CREDITS}` };
  }

  return { valid: true };
};
