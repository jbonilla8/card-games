import {
  areAllSuitsUnique,
  areAllRanksTheSame,
  areAllSuitsTheSame,
  isPartialSequenceValidForAnyFullSequence,
  sequenceAceHigh,
  sequenceAceLow
} from '../cardUtils';

// be able to meld set (3+ cards of the same rank of different suits)
export const canMeldSet = cards =>
  areAllSuitsUnique(cards) && areAllRanksTheSame(cards);

export const canMeldRun = cards =>
  areAllSuitsTheSame(cards) &&
  isPartialSequenceValidForAnyFullSequence(
    [sequenceAceHigh, sequenceAceLow],
    cards.map(card => card.rank)
  );

export const areCardsValidMeld = cards => {
  const result = {
    isValidMeld: false,
    isValidRun: false,
    isValidSet: false
  };

  // check if cards produce a valid meld
  const isValidSetToBeMelded = canMeldSet(cards);
  const isValidRunToBeMelded = canMeldRun(cards);

  if (cards.length >= 3 && (isValidSetToBeMelded || isValidRunToBeMelded)) {
    result.isValidMeld = true;
    result.isValidSet = isValidSetToBeMelded;
    result.isValidRun = isValidRunToBeMelded;
  }

  return result;
};

export const canDiscardCardBeMeldedFromHand = (cardFromDiscard, hand) => {
  const workingHand = [...hand];
  while (workingHand.length > 0) {
    const poppedCard = workingHand.pop();
    const foundValidMeld = workingHand.some(card =>
      areCardsValidMeld([cardFromDiscard, poppedCard, card]).isValidMeld
    );
    if (foundValidMeld) {
      return true;
    }
  }
  return false;
};

const calculatePointsForCard = (card, isCardInRun) => {
  switch (card.rank) {
    case '2':
      return 2;
    case '3':
      return 3;
    case '4':
      return 4;
    case '5':
      return 5;
    case '6':
      return 6;
    case '7':
      return 7;
    case '8':
      return 8;
    case '9':
      return 9;
    case '10':
    case 'J':
    case 'Q':
    case 'K':
      return 10;
    case 'A':
      return isCardInRun ? 1 : 15;
    default:
      throw new Error(`Invalid rank ${card.rank}`);
  }
};

export const calculatePointsForPlayer = player => {
  const sumReducer = (accumulator, currentValue) => accumulator + currentValue;
  const getPointsFromCards = (cards, areCardsRun) =>
    cards
      .map(card => calculatePointsForCard(card, areCardsRun))
      .reduce(sumReducer, 0);

  const pointsInHand = getPointsFromCards(player.hand, false);
  const pointsInMelds = player.melds
    .map(meld => getPointsFromCards(meld.cards, meld.isMeldRun))
    .reduce(sumReducer, 0);

  const totalPoints = pointsInMelds - pointsInHand;

  return { pointsInHand, pointsInMelds, totalPoints };
};
