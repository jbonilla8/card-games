import React, { useState, useEffect } from 'react';
import Deck from './components/Deck';
import styled from 'styled-components';
import DiscardPile from './components/DiscardPile';
import Player from './components/Player';
import OpponentMelds from './components/OpponentMelds';
import {
  Rummy500Phases,
  getAllValidMeldIds,
  getAllCardsInMeld,
  areCardsValidMeld,
  canDiscardCardBeMeldedFromHand,
  getRequiredCardToMeld
} from './utilities/Rummy/rummy500Utils';
import {
  buildShuffledDeck,
  getSelectedCardsFromPlayer,
  removeCardFromPlayersHand
} from './utilities/cardUtils';

const Rummy500 = () => {
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  const [discard, setDiscard] = useState([]);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(0);
  const [meldId, setMeldId] = useState(1);
  const [currentTurnPhase, setCurrentTurnPhase] = useState(
    Rummy500Phases.DRAW_PHASE
  );

  const currentPlayer = players[currentTurnPlayerId] || {};

  useEffect(() => {
    const numberOfPlayers = 2;

    let sizeOfHand = 13;
    let deck = buildShuffledDeck();

    if (numberOfPlayers > 2) {
      sizeOfHand = 7;
    }

    if (numberOfPlayers > 5) {
      deck = [...deck, buildShuffledDeck()].flat();
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
    if (deck.length > 0 && currentTurnPhase === Rummy500Phases.DRAW_PHASE) {
      const card = deck.pop();

      currentPlayer.hand.push(card);

      setDeck([...deck]);
      setPlayers([...players]);
      setCurrentTurnPhase(Rummy500Phases.PLAY_PHASE);
    } else {
      alert(
        "You can't draw twice, you may play a meld and must discard a card."
      );
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
    setCurrentTurnPhase(Rummy500Phases.DRAW_PHASE);
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
        if (
          areCardsValidMeld(
            selectedCards.concat(getAllCardsInMeld(players, meld.meldId))
          ).isValidMeld
        ) {
          meld.numberOfMeldableCardSlots = selectedCards.length;
        } else {
          meld.numberOfMeldableCardSlots = 0;
        }
      });
    });
    setPlayers([...players]);
  };

  const cardInHandClickedHandler = (clickedCard, currentPlayer) => {
    if (currentTurnPhase === Rummy500Phases.PLAY_PHASE) {
      clickedCard.isSelected = !clickedCard.isSelected;
      setPlayers([...players]);

      evaluatePlayableCardSlots(currentPlayer);
    } else {
      alert('You must draw a card from the deck or discard pile.');
    }
  };

  const onDiscardPileCardClickedHandler = clickedCard => {
    const canMeldFromHand = canDiscardCardBeMeldedFromHand(
      clickedCard,
      currentPlayer.hand
    );

    const canMeldToExistingMelds = getAllValidMeldIds(players).some(
      meldId =>
        areCardsValidMeld([...getAllCardsInMeld(players, meldId), clickedCard])
          .isValidMeld
    );

    if (currentTurnPhase !== Rummy500Phases.DRAW_PHASE) {
      alert('Not the right phase');
    } else if (discard.length === 0) {
      alert('No cards in discard');
    } else if (!(canMeldFromHand || canMeldToExistingMelds)) {
      alert(
        `The ${clickedCard.rank} of ${clickedCard.suit} cannot be picked up because is not part of a valid meld.`
      );
    } else {
      const clickedCardIndex = discard.indexOf(clickedCard);
      const cardsFromDiscardPile = discard.slice(clickedCardIndex);
      const newDiscardPile = discard.slice(0, clickedCardIndex);

      currentPlayer.hand = currentPlayer.hand.concat(cardsFromDiscardPile);

      clickedCard.mustBeMeldedRightAway = true;

      setDiscard([...newDiscardPile]);
      setPlayers([...players]);
      setCurrentTurnPhase(Rummy500Phases.PLAY_PHASE);
    }
  };

  const createMeldForPlayer = (player, meldId, cardsCurrentlyInMeld) => {
    const cardThatMustBeMelded = getRequiredCardToMeld(currentPlayer);
    const selectedCards = getSelectedCardsFromPlayer(player);

    if (cardThatMustBeMelded && !selectedCards.includes(cardThatMustBeMelded)) {
      alert(
        `You must play the ${cardThatMustBeMelded.rank} of ${cardThatMustBeMelded.suit} you picked from the discard pile.`
      );
      return;
    }

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
      card.mustBeMeldedRightAway = false;
      meld.cards.push(card);
      removeCardFromPlayersHand(player, card);
    });

    // add meld to player's melds
    player.melds.push(meld);

    setPlayers([...players]);
    evaluatePlayableCardSlots(player);
  };

  const onExtendMeldClickedHandler = (currentPlayer, meldId) => {
    const cardsCurrentlyInMeld = getAllCardsInMeld(players, meldId);
    createMeldForPlayer(currentPlayer, meldId, cardsCurrentlyInMeld);
  };

  const playerMeldClickedHandler = player => {
    createMeldForPlayer(player, meldId, []);
    setMeldId(meldId + 1);
  };

  const playerDiscardClickedHandler = player => {
    const selectedCards = getSelectedCardsFromPlayer(player);

    if (selectedCards.length === 0) {
      return;
    }

    if (selectedCards.length > 1) {
      throw new Error('you can not discard more than one card');
    }

    const cardThatMustBeMelded = getRequiredCardToMeld(currentPlayer);

    if (cardThatMustBeMelded) {
      alert(
        `You must play the ${cardThatMustBeMelded.rank} of ${cardThatMustBeMelded.suit} you picked from the discard pile.`
      );
      return;
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
              onExtendMeldClicked={meldId =>
                onExtendMeldClickedHandler(currentPlayer, meldId)
              }
            />
          ))}
      </CurrentPlayerArea>
      <OpponentMelds
        currentTurnPlayerId={currentTurnPlayerId}
        players={players}
        onExtendMeldClicked={meldId =>
          onExtendMeldClickedHandler(currentPlayer, meldId)
        }
      />
    </PlayingArea>
  );
}

export default Rummy500;

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
