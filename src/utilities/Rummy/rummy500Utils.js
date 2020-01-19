import { areAllSuitsUnique, areAllRanksTheSame } from '../cardUtils';

// be able to meld set (3+ cards of the same rank of different suits)
export const canMeldSet = cards =>
  areAllSuitsUnique(cards) && areAllRanksTheSame(cards);

export const canMeldRun = cards => 
  false;