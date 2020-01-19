import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Player 1 text', () => {
  const { getByText } = render(<App />);
  const player1Text = getByText(/Player 1/i);
  expect(player1Text).toBeInTheDocument();
});
