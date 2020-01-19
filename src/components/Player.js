import React, { Fragment } from 'react';
import styled from 'styled-components';
import Hand from './Hand';

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

const Player = props => {
  return (
    <Fragment>
      <div>{props.player.playerId}</div>
      <Hand
        player={props.player}
        onCardInHandClicked={props.onCardInHandClicked}
      />
      <PlayerControls>
        <PlayerControlButton onClick={() => props.onPlayerMeldClicked(props.player)}>Meld</PlayerControlButton>
        <PlayerControlButton onClick={() => props.onPlayerDiscardClicked(props.player)}>Discard</PlayerControlButton>
      </PlayerControls>
    </Fragment>
  );
};

export default Player;
