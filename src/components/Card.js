import React, { Fragment } from 'react';
import styled from 'styled-components';

const getCardSizeMultiplier = cardSize => {
  switch (cardSize) {
    case 'small':
      return 0.75;
    default:
      return 1.0;
  }
};

const getCardHeight = cardSize => {
  const height = getCardSizeMultiplier(cardSize) * 150;
  return height + 'px';
};

const getCardWidth = cardSize => {
  const width = getCardSizeMultiplier(cardSize) * 100;
  return width + 'px';
};

const CardBorder = styled.div`
  width: ${props => getCardWidth(props.cardSize)};
  height: ${props => getCardHeight(props.cardSize)};
  border-radius: 5px;
  box-shadow: ${props =>
    props.isSelected ? 'aquamarine 0px 0px 2px 2px' : '3px 3px 3px #333'};
  margin: 5px;
  padding: 5px;
  font-weight: bold;
  font-size: 18px;
  background-color: #fff;
  display: inline-grid;
  grid-template-columns: 20% auto 20%;
  grid-template-rows: auto auto auto;
  cursor: ${props => (props.onClick ? 'pointer' : 'auto')};

  img {
    height: 1rem;
  }
`;

const Rank = styled.div`
  font: 'Times New Roman', serif;
  color: ${props => props.color};
`;

const Suit = props => {
  let suitImageUrl;
  switch (props.suit) {
    case 'clubs':
      suitImageUrl = '/images/suits/club.png';
      break;
    case 'diamonds':
      suitImageUrl = '/images/suits/diamond.png';
      break;
    case 'hearts':
      suitImageUrl = '/images/suits/heart.png';
      break;
    case 'spades':
      suitImageUrl = '/images/suits/spade.png';
      break;
    default:
      throw new Error(
        `The [${props.suit}] suit that was passed in was not a valid suit`
      );
  }

  return (
    <div>
      <img src={suitImageUrl} alt={`The ${props.suit} card suit`} />
    </div>
  );
};

const CornerMarker = ({ suit, rank, color, className, ...props }) => {
  return (
    <div className={className}>
      <Rank color={color}>{rank}</Rank>
      <Suit suit={suit} />
    </div>
  );
};

const StyledCornerMarker = styled(CornerMarker)`
  grid-column: ${props => (props.bottomRight ? '3/4' : '1/2')};
  grid-row: ${props => (props.bottomRight ? '3/4' : '1/2')};
  transform: ${props => (props.bottomRight ? 'rotate(180deg)' : null)};
  align-self: ${props => (props.bottomRight ? 'end' : 'start')};
  justify-self: center;
`;

const CardCenter = ({ suit, rank, color, className, ...props }) => {
  return (
    <div className={className}>
      <Suit suit={suit} />
    </div>
  );
};

const StyledCardCenter = styled(CardCenter)`
  grid-column: 2/3;
  grid-row: 2/3;
  align-self: center;
  justify-self: center;

  img {
    height: 1.5rem;
  }
`;

const BackOfCard = styled.div`
  position: relative;
  background-color: midnightblue;
  grid-column: span 3;
  grid-row: span 3;

  &:after {
    position: absolute;
    left: 5px;
    right: 5px;
    top: 5px;
    bottom: 5px;
    border: 1px solid white;
    content: "";
  }
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
      cardSize={props.cardSize}
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
