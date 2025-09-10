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
  nextTurn: () => void;
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
    // This will be implemented in the next step
    console.log(`Applying operation: ${operation}`);
  };

  const nextTurn = () => {
    setGameState(prevState => {
      if (prevState.players.length === 0) return prevState;

      const isLastPlayer = prevState.currentPlayerIndex === prevState.players.length - 1;
      const isLastRound = prevState.round === 6;

      if (isLastPlayer && isLastRound) {
        const winner = prevState.players.reduce((prev, current) => 
          (prev.score > current.score) ? prev : current
        );
        return {
          ...prevState,
          gamePhase: 'finished',
          winner: winner,
        };
      }

      const nextPlayerIndex = (prevState.currentPlayerIndex + 1) % prevState.players.length;
      const nextRound = nextPlayerIndex === 0 ? prevState.round + 1 : prevState.round;

      return {
        ...prevState,
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
    <GameContext.Provider value={{ gameState, initializeGame, applyOperation, nextTurn, resetGame }}>
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