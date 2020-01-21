import React, { Fragment } from 'react';
import styled from 'styled-components';
import Hand from './Hand';
import PlayerMelds from './PlayerMelds';

const PlayerControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
`;

const PlayerControlButton = styled.button`
  display: block;
  width: 120px;
  height: 40px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 18px;
  border-radius: 5px;
  color: #000;
  box-shadow: 2px 2px 2px 2px;
  margin: 0 5px;
  cursor: ${props => (props.onClick ? 'pointer' : 'auto')};
`;

const PlayerLabel = styled.div`
  margin-top: 40px;
`;

const Player = props => {
  return (
    <Fragment>
      <PlayerLabel>Player {props.player.playerId + 1}</PlayerLabel>
      <Hand
        player={props.player}
        onCardInHandClicked={props.onCardInHandClicked}
      />
      <PlayerControls>
        <PlayerControlButton onClick={() => props.onPlayerMeldClicked(props.player)}>Meld</PlayerControlButton>
        <PlayerControlButton onClick={() => props.onPlayerDiscardClicked(props.player)}>Discard</PlayerControlButton>
      </PlayerControls>
      <PlayerMelds player={props.player} />
    </Fragment>
  );
};

export default Player;
