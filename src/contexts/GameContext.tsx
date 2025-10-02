import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOperationForQrCode, getCombinationOperation } from '@/lib/qr-operations';

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
  pendingQrCode: string | null;
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
    pendingQrCode: null,
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
      pendingQrCode: null,
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

  const applyOperation = (qrCode: string) => {
    setGameState(prevState => {
      const { round, pendingQrCode, players, currentPlayerIndex } = prevState;
      const currentPlayer = players[currentPlayerIndex];
      if (!currentPlayer) return prevState;

      let operationValue: number | null = null;
      let isFirstScanOfPair = false;

      // Determine operation value based on round
      if (round >= 4 && round <= 5) {
        if (!pendingQrCode) {
          isFirstScanOfPair = true;
        } else {
          if (pendingQrCode === qrCode) {
            return { ...prevState, pendingQrCode: null }; // Invalid move, reset turn
          }
          operationValue = getCombinationOperation(pendingQrCode, qrCode);
        }
      } else {
        operationValue = getOperationForQrCode(qrCode, round);
      }

      // Handle the first scan of a pair in rounds 4-5
      if (isFirstScanOfPair) {
        return { ...prevState, pendingQrCode: qrCode };
      }

      // Handle invalid QR codes or combinations
      if (operationValue === null) {
        const resetPending = (round >= 4 && round <= 5);
        console.error(`Invalid operation for QR code(s) in round ${round}.`);
        return { ...prevState, pendingQrCode: resetPending ? null : pendingQrCode };
      }

      // Apply the operation and update game state
      const newScore = currentPlayer.score + operationValue;
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex] = { ...currentPlayer, score: newScore };

      // Check for win/end conditions
      const otherPlayers = updatedPlayers.filter(p => p.id !== currentPlayer.id);
      const hasWinningMatch = otherPlayers.some(p => p.number === newScore);

      if (hasWinningMatch) {
        return {
          ...prevState,
          players: updatedPlayers,
          gamePhase: 'finished',
          winner: updatedPlayers[currentPlayerIndex],
          pendingQrCode: null,
        };
      }

      const isLastPlayer = currentPlayerIndex === updatedPlayers.length - 1;
      const isLastRound = round === 5; // Changed from 6 to 5

      if (isLastPlayer && isLastRound) {
        const eligiblePlayers = updatedPlayers.filter(p => p.score <= 100);
        let winner = null;
        if (eligiblePlayers.length > 0) {
          winner = eligiblePlayers.reduce((prev, current) => (prev.score > current.score) ? prev : current);
        }
        return {
          ...prevState,
          players: updatedPlayers,
          gamePhase: 'finished',
          winner: winner,
          pendingQrCode: null,
        };
      }

      // Progress to the next turn
      const nextPlayerIndex = (currentPlayerIndex + 1) % updatedPlayers.length;
      const nextRound = nextPlayerIndex === 0 ? round + 1 : round;

      return {
        ...prevState,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        round: nextRound,
        pendingQrCode: null, // Reset for next turn
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
      pendingQrCode: null,
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