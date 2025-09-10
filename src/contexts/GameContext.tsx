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
  gamePhase: 'setup' | 'playing' | 'finished';
  winner: Player | null;
}

interface GameContextType {
  gameState: GameState;
  initializeGame: (playerNames: string[]) => void;
  applyOperation: (operation: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    round: 0,
    currentPlayerIndex: 0,
    gamePhase: 'setup',
    winner: null,
  });
  const navigate = useNavigate();

  const initializeGame = (playerNames: string[]) => {
    const newPlayers: Player[] = playerNames.map((name, index) => {
      const randomNumber = Math.floor(Math.random() * 51) + 50; // Random number between 50-100
      return {
        id: index,
        name,
        score: randomNumber, // Score starts equal to number
        number: randomNumber,
      };
    });

    setGameState({
      players: newPlayers,
      round: 1,
      currentPlayerIndex: 0,
      gamePhase: 'playing',
      winner: null,
    });
    navigate('/game');
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

      // --- Turn Progression Logic ---
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
      gamePhase: 'setup',
      winner: null,
    });
    navigate('/');
  };

  return (
    <GameContext.Provider value={{ gameState, initializeGame, applyOperation, resetGame }}>
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