import React, { Fragment } from 'react';
import styled from 'styled-components';

const CardBorder = styled.div`
  width: 100px;
  height: 150px;
  border-radius: 5px;
  box-shadow: ${props =>
    props.isSelected ? 'aquamarine 0px 0px 2px 2px' : '3px 3px 3px #333'};
  margin: 5px;
  padding-left: 5px;
  padding-right: 5px;
  font-weight: bold;
  font-size: 18px;
  background-color: #fff;
  display: inline-grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
  grid-template-rows: 20% 20% 20% 20% 20%;
  cursor: ${props => (props.onClick ? 'pointer' : 'auto')};
`;

const Rank = styled.div`
  font: 'Times New Roman', serif;
  color: ${props => props.color};
`;

const Suit = styled.div`
  color: ${props => props.color};
`;

const CornerMarker = ({ suit, rank, color, className, ...props }) => {
  return (
    <div className={className}>
      <Rank color={color}>{rank}</Rank>
      <Suit color={color}></Suit>
    </div>
  );
};

const StyledCornerMarker = styled(CornerMarker)`
  grid-column: ${props => (props.bottomRight ? '5/6' : '1/2')};
  grid-row: ${props => (props.bottomRight ? '5/6' : '1/2')};
  transform: ${props => (props.bottomRight ? 'rotate(180deg)' : null)};
  align-self: center;
  justify-self: center;
`;

const CardCenter = ({ suit, rank, color, className, ...props }) => {
  return (
    <div className={className}>
      <Suit color={color}>{suit}</Suit>
    </div>
  );
};

const StyledCardCenter = styled(CardCenter)`
  grid-column: 3/4;
  grid-row: 3/4;
  align-self: center;
  justify-self: center;
`;

const BackOfCard = styled.div`
  margin: 5px;
  background-color: #7c45a4;
  height: 100%;
  width: 100%;
`;

const card = ({ suit, rank, onCardClick, ...props }) => {
  let color = '';

  switch (suit) {
    case 'clubs':
    case 'spades':
      color = 'black';
      break;
    case 'hearts':
    case 'diamonds':
      color = 'red';
      break;
    default:
      color = 'none';
      break;
  }

  return (
    <CardBorder
      onClick={onCardClick}
      isCardFaceDown={props.isCardFaceDown}
      isSelected={props.isSelected}
    >
      {props.isCardFaceDown ? (
        <BackOfCard />
      ) : (
        <Fragment>
          <StyledCornerMarker rank={rank} suit={suit} color={color} />
          <StyledCardCenter rank={rank} suit={suit} color={color} />
          <StyledCornerMarker
            bottomRight={true}
            rank={rank}
            suit={suit}
            color={color}
          />
        </Fragment>
      )}
    </CardBorder>
  );
};

export default card;
