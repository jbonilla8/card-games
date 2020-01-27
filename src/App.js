import React, { useState, useEffect } from 'react';
import Deck from './components/Deck';
import styled from 'styled-components';
import DiscardPile from './components/DiscardPile';
import Player from './components/Player';
import { canMeldSet, canMeldRun } from './utilities/Rummy/rummy500Utils';
import OpponentMelds from './components/OpponentMelds';

const PlayingArea = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  width: 100%;
  margin: auto;
  color: #fff;
  font-weight: bold;
  height: 100%;
`;

const CurrentPlayerArea = styled.div`
  border-right: 2px solid #2e482e;
`;

const DeckDiscardWrapper = styled.div`
  display: flex;
`;

const buildDeck = () => {
  const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  const ranks = [
    'A',
    'K',
    'Q',
    'J',
    '10',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2'
  ];

  const cards = ranks
    .map(rank =>
      suits.map(suit => ({
        suit: suit,
        rank: rank
      }))
    )
    .flat();

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  };

  cards.sort(() => getRandomInt(-1, 1));

  return cards;
};

function App() {
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  const [discard, setDiscard] = useState([]);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(0);
  const [meldId, setMeldId] = useState(1);

  useEffect(() => {
    const numberOfPlayers = 2;

    let sizeOfHand = 13;
    let deck = buildDeck();

    if (numberOfPlayers > 2) {
      sizeOfHand = 7;
    }
    if (numberOfPlayers > 5) {
      deck = [...deck, buildDeck()].flat();
    }

    for (var playerId = 0; playerId < numberOfPlayers; playerId++) {
      const hand = [];
      const melds = [];
      players.push({ hand: hand, playerId, melds });
    }

    for (var i = 0; i < sizeOfHand; i++) {
      players.forEach(player => {
        const card = deck.pop();
        player.hand.push(card);
      });
    }

    setDiscard([deck.pop()]);
    setDeck(deck);
    setPlayers(players);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deckClickedHandler = () => {
    if (deck.length > 0) {
      const card = deck.pop();

      players[currentTurnPlayerId].hand.push(card);

      setDeck([...deck]);
      setPlayers([...players]);
    }
  };

  const discardCardFromHand = (cardToDiscard, currentPlayer) => {
    cardToDiscard.isSelected = false;

    evaluatePlayableCardSlots(currentPlayer);

    discard.push(cardToDiscard);

    removeCardFromPlayersHand(currentPlayer, cardToDiscard);

    setPlayers([...players]);

    setDiscard([...discard]);
    const nextTurnPlayerId = (currentTurnPlayerId + 1) % players.length;
    setCurrentTurnPlayerId(nextTurnPlayerId);
  };

  const areCardsValidMeld = cards => {
    const result = {
      isValidMeld: false,
      isValidRun: false,
      isValidSet: false
    };

    // check if cards produce a valid meld
    const isValidSetToBeMelded = canMeldSet(cards);
    const isValidRunToBeMelded = canMeldRun(cards);

    if (cards.length >= 3 && (isValidSetToBeMelded || isValidRunToBeMelded)) {
      result.isValidMeld = true;
      result.isValidSet = isValidSetToBeMelded;
      result.isValidRun = isValidRunToBeMelded;
    }

    return result;
  };

  const evaluatePlayableCardSlots = currentPlayer => {
    const selectedCards = getSelectedCardsFromPlayer(currentPlayer);
    // for discards - if only 1 card is selected, and if in discard phase, show slot in discard
    if (selectedCards.length === 1) {
      currentPlayer.canDiscardSelectedCard = true;
    } else {
      currentPlayer.canDiscardSelectedCard = false;
    }

    // for melds - check cards in hand for valid melds, make sure card has been drawn 1st, if so - make playableCardSlot appear in current player's meld area
    if (areCardsValidMeld(selectedCards).isValidMeld) {
      currentPlayer.numberOfMeldableCardSlots = selectedCards.length;
    } else {
      currentPlayer.numberOfMeldableCardSlots = 0;
    }

    // for melding off of other players' melds - check other players' melds for valid melds and show slots for these areas
    players.forEach(player => {
      player.melds.forEach(meld => {
        if (areCardsValidMeld(selectedCards.concat(meld.cards)).isValidMeld) {
          meld.numberOfMeldableCardSlots = selectedCards.length;
        } else {
          meld.numberOfMeldableCardSlots = 0;
        }
      });
    });
    setPlayers([...players]);
  };

  const cardInHandClickedHandler = (clickedCard, currentPlayer) => {
    clickedCard.isSelected = !clickedCard.isSelected;
    setPlayers([...players]);

    evaluatePlayableCardSlots(currentPlayer);
  };

  const onDiscardPileCardClickedHandler = clickedCard => {
    const clickedCardIndex = discard.indexOf(clickedCard);
    const cardsFromDiscardPile = discard.slice(clickedCardIndex);
    const newDiscardPile = discard.slice(0, clickedCardIndex);

    players[currentTurnPlayerId].hand = players[
      currentTurnPlayerId
    ].hand.concat(cardsFromDiscardPile);

    setDiscard([...newDiscardPile]);
    setPlayers([...players]);
  };

  const removeCardFromPlayersHand = (player, card) => {
    const index = player.hand.indexOf(card);
    player.hand.splice(index, 1);
  };

  const createMeldForPlayer = (player, meldId, cardsCurrentlyInMeld) => {
    const selectedCards = getSelectedCardsFromPlayer(player);

    const validMeldResult = areCardsValidMeld(
      selectedCards.concat(cardsCurrentlyInMeld)
    );

    if (!validMeldResult.isValidMeld) {
      throw new Error('This is an invalid meld');
    }

    // update state to show that meld has happened
    const meld = {
      cards: [],
      meldId: meldId,
      isMeldSet: validMeldResult.isValidSet,
      isMeldRun: validMeldResult.isValidRun
    };

    selectedCards.forEach(card => {
      card.isSelected = false;
      meld.cards.push(card);
      removeCardFromPlayersHand(player, card);
    });

    // add meld to player's melds
    player.melds.push(meld);

    setPlayers([...players]);
    evaluatePlayableCardSlots(player);
  };

  const onExtendMeldClickedHandler = (currentPlayer, meldId) => {
    const cardsCurrentlyInMeld = players
      .map(player => player.melds)
      .flat()
      .filter(meld => meld.meldId === meldId)
      .map(meld => meld.cards)
      .flat();
    createMeldForPlayer(currentPlayer, meldId, cardsCurrentlyInMeld);
  };

  const playerMeldClickedHandler = player => {
    createMeldForPlayer(player, meldId, []);
    setMeldId(meldId + 1);
  };

  const getSelectedCardsFromPlayer = player =>
    player.hand.filter(card => card.isSelected);

  const playerDiscardClickedHandler = player => {
    const selectedCards = getSelectedCardsFromPlayer(player);

    if (selectedCards.length === 0) {
      return;
    }
    if (selectedCards.length > 1) {
      throw new Error('you can not discard more than one card');
    }

    const cardToDiscard = selectedCards[0];
    discardCardFromHand(cardToDiscard, player);
  };

  const currentPlayer = players[currentTurnPlayerId] || {};

  return (
    <PlayingArea>
      <CurrentPlayerArea>
        <DeckDiscardWrapper>
          <Deck onDeckClicked={deckClickedHandler} />
          <DiscardPile
            discard={discard}
            onDiscardPileCardClicked={onDiscardPileCardClickedHandler}
            onDiscardPlayableSlotClicked={() =>
              playerDiscardClickedHandler(currentPlayer)
            }
            showDiscardPlayableCardSlot={currentPlayer.canDiscardSelectedCard}
          />
        </DeckDiscardWrapper>
        {players
          .filter(player => currentTurnPlayerId === player.playerId)
          .map(player => (
            <Player
              key={player.playerId}
              player={player}
              onCardInHandClicked={cardInHandClickedHandler}
              onPlayerDiscardClicked={playerDiscardClickedHandler}
              onPlayerMeldClicked={playerMeldClickedHandler}
              onExtendMeldClicked={(meldId) => onExtendMeldClickedHandler(currentPlayer, meldId)}
            />
          ))}
      </CurrentPlayerArea>
      <OpponentMelds
        currentTurnPlayerId={currentTurnPlayerId}
        players={players}
        onExtendMeldClicked={(meldId) => onExtendMeldClickedHandler(currentPlayer, meldId)}
      />
    </PlayingArea>
  );
}

export default App;
