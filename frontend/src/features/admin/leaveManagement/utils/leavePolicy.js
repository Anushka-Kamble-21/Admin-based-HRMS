export const MONTHLY_FREE_LEAVE = 1;
export const MAX_FREE_LEAVE = 2;

export const isPaidLeave = (usedLeaves, duration) => {
  if (usedLeaves + duration <= MONTHLY_FREE_LEAVE) return true;
  if (usedLeaves < MAX_FREE_LEAVE && usedLeaves + duration <= MAX_FREE_LEAVE)
    return true;
  return false;
};
