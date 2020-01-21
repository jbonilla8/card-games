import React, { Fragment } from 'react';
import Meld from './Meld';

const PlayerMelds = props => {
  return (
    <Fragment>
      {props.player.melds.map(meld => (
        <Meld
          meld={meld}
          onCardClick={() => props.onCardInHandClicked(null, props.player)}
        />
      ))}
    </Fragment>
  );
};

export default PlayerMelds;