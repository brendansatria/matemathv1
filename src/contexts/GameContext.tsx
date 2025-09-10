import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface Player {
  id: number;
  name: string;
  score: number;
  number: number;
}

interface GameState {
  players: Player[];
  round: number;
  currentPlayerIndex: number;
  numberSelectionIndex: number;
  gamePhase: 'setup' | 'number-selection' | 'playing' | 'finished';
  winner: Player | null;
  chosenNumbers: number[];
}

interface GameContextType {
  gameState: GameState;
  initializeGame: (playerNames: string[]) => void;
  setPlayerNumber: (chosenNumber: number) => void;
  applyOperation: (operation: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    round: 0,
    currentPlayerIndex: 0,
    numberSelectionIndex: 0,
    gamePhase: 'setup',
    winner: null,
    chosenNumbers: [],
  });
  const navigate = useNavigate();

  const initializeGame = (playerNames: string[]) => {
    const newPlayers: Player[] = playerNames.map((name, index) => ({
      id: index,
      name,
      score: 0,
      number: 0,
    }));

    setGameState({
      ...gameState,
      players: newPlayers,
      round: 0,
      currentPlayerIndex: 0,
      numberSelectionIndex: 0,
      gamePhase: 'number-selection',
      winner: null,
      chosenNumbers: [],
    });
    navigate('/initial-number');
  };

  const setPlayerNumber = (chosenNumber: number) => {
    setGameState(prevState => {
      const updatedPlayers = [...prevState.players];
      const currentPlayer = updatedPlayers[prevState.numberSelectionIndex];
      
      updatedPlayers[prevState.numberSelectionIndex] = {
        ...currentPlayer,
        number: chosenNumber,
        score: chosenNumber,
      };

      const newChosenNumbers = [...prevState.chosenNumbers, chosenNumber];
      const nextSelectionIndex = prevState.numberSelectionIndex + 1;

      if (nextSelectionIndex >= updatedPlayers.length) {
        navigate('/game');
        return {
          ...prevState,
          players: updatedPlayers,
          chosenNumbers: newChosenNumbers,
          gamePhase: 'playing',
          round: 1,
        };
      } else {
        return {
          ...prevState,
          players: updatedPlayers,
          chosenNumbers: newChosenNumbers,
          numberSelectionIndex: nextSelectionIndex,
        };
      }
    });
  };

  const applyOperation = (operation: string) => {
    setGameState(prevState => {
      const currentPlayer = prevState.players[prevState.currentPlayerIndex];
      if (!currentPlayer) return prevState;

      let newScore = currentPlayer.score;
      const operationType = operation.charAt(0);
      const value = parseInt(operation.substring(1), 10);

      if (isNaN(value)) {
        console.error("Invalid operation value:", operation);
        return prevState;
      }

      switch (operationType) {
        case '+':
          newScore += value;
          break;
        case '-':
          newScore -= value;
          break;
        default:
          console.error("Unknown operation type:", operation);
          return prevState;
      }

      const updatedPlayers = [...prevState.players];
      updatedPlayers[prevState.currentPlayerIndex] = {
        ...currentPlayer,
        score: newScore,
      };

      // New "sudden death" win condition check
      const otherPlayers = updatedPlayers.filter(p => p.id !== currentPlayer.id);
      const hasWinningMatch = otherPlayers.some(p => p.number === newScore);

      if (hasWinningMatch) {
        return {
          ...prevState,
          players: updatedPlayers,
          gamePhase: 'finished',
          winner: updatedPlayers[prevState.currentPlayerIndex],
        };
      }

      // Standard end-of-game check
      const isLastPlayer = prevState.currentPlayerIndex === updatedPlayers.length - 1;
      const isLastRound = prevState.round === 6;

      if (isLastPlayer && isLastRound) {
        const winner = updatedPlayers.reduce((prev, current) =>
          (prev.score > current.score) ? prev : current
        );
        return {
          ...prevState,
          players: updatedPlayers,
          gamePhase: 'finished',
          winner: winner,
        };
      }

      // Progress to the next turn
      const nextPlayerIndex = (prevState.currentPlayerIndex + 1) % updatedPlayers.length;
      const nextRound = nextPlayerIndex === 0 ? prevState.round + 1 : prevState.round;

      return {
        ...prevState,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        round: nextRound,
      };
    });
  };

  const resetGame = () => {
    setGameState({
      players: [],
      round: 0,
      currentPlayerIndex: 0,
      numberSelectionIndex: 0,
      gamePhase: 'setup',
      winner: null,
      chosenNumbers: [],
    });
    navigate('/');
  };

  return (
    <GameContext.Provider value={{ gameState, initializeGame, setPlayerNumber, applyOperation, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};