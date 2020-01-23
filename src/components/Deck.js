import React from 'react';
import Card from './Card';

const Deck = props => {
  return <Card onCardClick={props.onDeckClicked} isCardFaceDown={true} />;
};

export default Deck;
