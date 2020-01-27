import React, { Fragment } from 'react';
import PlayerMelds from './PlayerMelds';

const OpponentMelds = props => {
  const opponentPlayers = props.players.filter(
    player => player.playerId !== props.currentTurnPlayerId
  );

  return (
    <div>
      {opponentPlayers.map(player => (
        <Fragment>
          Player {player.playerId + 1}
          <PlayerMelds
            cardSize="small"
            player={player}
            onExtendMeldClicked={props.onExtendMeldClicked}
          />
        </Fragment>
      ))}
    </div>
  );
};

export default OpponentMelds;
