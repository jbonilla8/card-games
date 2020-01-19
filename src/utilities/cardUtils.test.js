import {
  isPartialSequenceValid,
  isPartialSequenceValidForAnyFullSequence,
  sequenceAceHigh,
  sequenceAceLow
} from './cardUtils';

test('checking sequence returns true when valid (ace high)', () => {
  const result = isPartialSequenceValid(sequenceAceHigh, ['A', 'K', 'Q']);
  expect(result).toBe(true);
});

test('checking sequence returns false when duplicates exist', () => {
  const result = isPartialSequenceValid(sequenceAceHigh, [
    'A',
    'K',
    'Q',
    'Q',
    'K'
  ]);
  expect(result).toBe(false);
});

test('checking sequence returns true when valid (ace low)', () => {
  const result = isPartialSequenceValid(sequenceAceLow, ['3', '2', 'A']);
  expect(result).toBe(true);
});

test('checking empty sequence returns false', () => {
  const result = isPartialSequenceValid(sequenceAceLow, []);
  expect(result).toBe(false);
});

test('checking invalid sequence returns false', () => {
  const result = isPartialSequenceValid(sequenceAceLow, ['K', '10', '8']);
  expect(result).toBe(false);
});

test('checking valid sequence returns true', () => {
  const result = isPartialSequenceValidForAnyFullSequence(
    [sequenceAceLow, sequenceAceHigh],
    ['A', '2', '3']
  );
  expect(result).toBe(true);
});
