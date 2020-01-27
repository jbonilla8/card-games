import React, { Fragment } from 'react';
import Meld from './Meld';

const PlayerMelds = props => {
  return (
    <Fragment>
      {props.player.melds.map(meld => (
        <Meld
          cardSize={props.cardSize}
          meld={meld}
          player={props.player}
          onExtendMeldClicked={props.onExtendMeldClicked}
        />
      ))}
    </Fragment>
  );
};

export default PlayerMelds;
