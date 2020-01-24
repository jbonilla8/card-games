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
  border-right: 2px solid #2E482E;
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

    discard.push(cardToDiscard);

    removeCardFromPlayersHand(currentPlayer, cardToDiscard);

    setPlayers([...players]);

    setDiscard([...discard]);
    const nextTurnPlayerId = (currentTurnPlayerId + 1) % players.length;
    setCurrentTurnPlayerId(nextTurnPlayerId);
  };

  const cardInHandClickedHandler = (clickedCard, currentPlayer) => {
    clickedCard.isSelected = !clickedCard.isSelected;
    setPlayers([...players]);
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

  const playerMeldClickedHandler = player => {
    // get selected cards
    const selectedCards = getSelectedCardsFromPlayer(player);

    if (selectedCards.length === 0) {
      return;
    }

    if (selectedCards.length < 3) {
      throw new Error('you cannot meld less than 3 cards'); // todo - meld off other players
    }
    // check if cards produce a valid meld
    const isValidSetToBeMelded = canMeldSet(selectedCards);
    const isValidRunToBeMelded = canMeldRun(selectedCards);

    if (!(isValidSetToBeMelded || isValidRunToBeMelded)) {
      throw new Error(
        'The cards can not be melded, it is not a valid set or run'
      );
    }

    // update state to show that meld has happened
    const meld = {
      cards: [],
      meldId: meldId,
      isMeldSet: canMeldSet,
      isMeldRun: canMeldRun
    };

    selectedCards.forEach(card => {
      card.isSelected = false;
      meld.cards.push(card);
      removeCardFromPlayersHand(player, card);
    });

    // add meld to player's melds
    player.melds.push(meld);

    setPlayers([...players]);
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

  return (
    <PlayingArea>
      <CurrentPlayerArea>
        <DeckDiscardWrapper>
          <Deck onDeckClicked={deckClickedHandler} />
          <DiscardPile
            discard={discard}
            onDiscardPileCardClicked={onDiscardPileCardClickedHandler}
          />
        </DeckDiscardWrapper>
        {players
          .filter(player => currentTurnPlayerId === player.playerId)
          .map(player => (
            <Player
              key={player.playerId}
              player={player}
              onCardInHandClicked={cardInHandClickedHandler}
              onPlayerMeldClicked={playerMeldClickedHandler}
              onPlayerDiscardClicked={playerDiscardClickedHandler}
            />
          ))}
      </CurrentPlayerArea>
      <OpponentMelds
        currentTurnPlayerId={currentTurnPlayerId}
        players={players}
      />
    </PlayingArea>
  );
}

export default App;
