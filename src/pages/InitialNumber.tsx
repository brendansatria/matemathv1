import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const generateOptions = (existingNumbers: number[]): number[] => {
  const options = new Set<number>();
  while (options.size < 3) {
    const newNum = Math.floor(Math.random() * 51) + 50;
    if (!existingNumbers.includes(newNum)) {
      options.add(newNum);
    }
  }
  return Array.from(options);
};

const InitialNumber = () => {
  const { gameState, setPlayerNumber } = useGame();
  const { players, numberSelectionIndex, gamePhase, chosenNumbers } = gameState;
  const navigate = useNavigate();
  const [numberOptions, setNumberOptions] = useState<number[]>([]);

  useEffect(() => {
    if (gamePhase !== 'number-selection' || players.length === 0) {
      navigate('/');
    } else {
      setNumberOptions(generateOptions(chosenNumbers));
    }
  }, [gamePhase, players, numberSelectionIndex, chosenNumbers, navigate]);

  if (gamePhase !== 'number-selection' || players.length === 0 || !players[numberSelectionIndex]) {
    return null; // or a loading indicator
  }

  const currentPlayer = players[numberSelectionIndex];

  const handleNumberSelect = (number: number) => {
    setPlayerNumber(number);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Choose Your Number</CardTitle>
          <CardDescription>
            It's <span className="font-semibold">{currentPlayer.name}'s</span> turn to pick a starting number.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">This will be your starting number and score.</p>
          <div className="grid grid-cols-3 gap-4">
            {numberOptions.map((option) => (
              <Button
                key={option}
                onClick={() => handleNumberSelect(option)}
                className="h-24 text-3xl font-bold"
                variant="outline"
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InitialNumber;