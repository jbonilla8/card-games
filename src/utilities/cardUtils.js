const areAllItemsUnique = items => {
  const set = new Set(items);
  return set.size === items.length;
};

const areAllItemsTheSame = items => {
  const set = new Set(items);
  return set.size === 1;
};

export const areAllSuitsTheSame = cards =>
  areAllItemsTheSame(cards.map(card => card.suit));

export const areAllSuitsUnique = cards =>
  areAllItemsUnique(cards.map(card => card.suit));

export const areAllRanksTheSame = cards =>
  areAllItemsTheSame(cards.map(card => card.rank));

export const areAllRanksUnique = cards =>
  areAllItemsUnique(cards.map(card => card.rank));
