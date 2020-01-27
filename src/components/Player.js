import React, { Fragment } from 'react';
import styled from 'styled-components';
import Hand from './Hand';
import PlayerMelds from './PlayerMelds';
import { PlayableCardSlot } from './Card';
import { calculatePointsForPlayer } from '../utilities/Rummy/rummy500Utils';

const PlayerLabel = styled.div`
  margin-top: 40px;
`;

const Player = props => {
  const points = calculatePointsForPlayer(props.player);

  return (
    <Fragment>
      <PlayerLabel>
        Player {props.player.playerId + 1} | Score: {points.totalPoints}
      </PlayerLabel>
      <Hand
        player={props.player}
        onCardInHandClicked={props.onCardInHandClicked}
      />
      <div>
        {[...Array(props.player.numberOfMeldableCardSlots || 0)].map(_ => (
          <PlayableCardSlot
            onClick={() => props.onPlayerMeldClicked(props.player)}
          />
        ))}
      </div>
      <PlayerMelds
        player={props.player}
        onExtendMeldClicked={props.onExtendMeldClicked}
      />
    </Fragment>
  );
};

export default Player;
