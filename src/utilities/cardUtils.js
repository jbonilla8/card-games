const areAllItemsUnique = items => {
  const set = new Set(items);
  return set.size === items.length;
};

const areAllItemsTheSame = items => {
  const set = new Set(items);
  return set.size === 1;
};

export const sequenceAceHigh = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3","2" ];
export const sequenceAceLow = ["K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3","2", "A" ];


export const isPartialSequenceValid = (
  fullSequence,
  partialSequenceToBeChecked
) => {

  const sortedPartialSequenceToBeChecked = fullSequence.filter(rank => partialSequenceToBeChecked.includes(rank));
  
  // bail early if we get early clues that it's invalid
  if(partialSequenceToBeChecked.length === 0) {
    return false;
  }
  else if (sortedPartialSequenceToBeChecked.length !== partialSequenceToBeChecked.length) {
    return false;
  }

  const fullSequenceString = fullSequence.join();
  const partialSequenceToBeCheckedString = sortedPartialSequenceToBeChecked.join();

  return fullSequenceString.includes(partialSequenceToBeCheckedString);
};

export const isPartialSequenceValidForAnyFullSequence = (
  fullSequenceList,
  partialSequenceToBeChecked
) => {
  return fullSequenceList.some(fs =>
    isPartialSequenceValid(fs, partialSequenceToBeChecked)
  );
};

export const areAllSuitsTheSame = cards =>
  areAllItemsTheSame(cards.map(card => card.suit));

export const areAllSuitsUnique = cards =>
  areAllItemsUnique(cards.map(card => card.suit));

export const areAllRanksTheSame = cards =>
  areAllItemsTheSame(cards.map(card => card.rank));

export const areAllRanksUnique = cards =>
  areAllItemsUnique(cards.map(card => card.rank));
