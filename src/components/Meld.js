import React from 'react';
import styled from 'styled-components';
import Card, { PlayableCardSlot } from './Card';

const MeldContainer = styled.div`
  display: flex;
`;

const Meld = props => {
  return (
    <MeldContainer>
      {props.meld.cards.map(card => (
        <Card {...card} cardSize={props.cardSize} />
      ))}
      {[...Array(props.meld.numberOfMeldableCardSlots || 0)].map(_ => (
        <PlayableCardSlot
          cardSize={props.cardSize}
          onClick={() => props.onExtendMeldClicked(props.meld.meldId)}
        />
      ))}
    </MeldContainer>
  );
};

export default Meld;
