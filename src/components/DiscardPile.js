import React, { Fragment } from 'react';
import Card from './Card';

const DiscardPile = props => {
  return (
    <Fragment>
      {props.discard.map(card => (
        <Card {...card} onCardClick={() => props.onDiscardPileCardClicked(card)} />
      ))}
    </Fragment>
  );
};

export default DiscardPile;