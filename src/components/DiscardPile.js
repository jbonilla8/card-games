import React, { Fragment } from 'react';
import Card, { PlayableCardSlot } from './Card';

const DiscardPile = props => {
  return (
    <Fragment>
      {props.discard.map(card => (
        <Card
          {...card}
          onCardClick={() => props.onDiscardPileCardClicked(card)}
        />
      ))}
      {props.showDiscardPlayableCardSlot ? (
        <PlayableCardSlot onClick={props.onDiscardPlayableSlotClicked} />
      ) : null}
    </Fragment>
  );
};

export default DiscardPile;
