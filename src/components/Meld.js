import React, { Fragment } from 'react';
import Card from './Card';

const Meld = (props) => {
  return (
    <Fragment>
      {props.meld.cards.map(card => (
        <Card
          {...card}
          onCardClick={() => props.onCardInHandClicked(card, props.player)}
        />
      ))}
    </Fragment>
  );
};

export default Meld;
