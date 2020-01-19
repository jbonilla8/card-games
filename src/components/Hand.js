import React, { Fragment } from 'react';
import Card from './Card';

const Hand = (props) => {
  return (
    <Fragment>
      {props.player.hand.map(card => (
        <Card
          {...card}
          onCardClick={() => props.onCardInHandClicked(card, props.player)}
        />
      ))}
    </Fragment>
  );
};

export default Hand;
