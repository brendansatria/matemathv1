import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X } from 'lucide-react';

const Setup = () => {
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2']);
  const { initializeGame } = useGame();

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const addPlayer = () => {
    if (playerNames.length < 6) {
      setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      const newNames = playerNames.filter((_, i) => i !== index);
      setPlayerNames(newNames);
    }
  };

  const handleStartGame = () => {
    const validPlayerNames = playerNames.filter(name => name.trim() !== '');
    if (validPlayerNames.length < 2) {
      alert('Please enter at least 2 player names.');
      return;
    }
    initializeGame(validPlayerNames);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Mate-Math</CardTitle>
          <CardDescription className="text-center">Enter player names to begin (2-6 players).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {playerNames.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder={`Player ${index + 1}`}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="flex-grow"
                />
                {playerNames.length > 2 && (
                  <Button variant="ghost" size="icon" onClick={() => removePlayer(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={addPlayer} disabled={playerNames.length >= 6} className="w-full" variant="outline">
              Add Player
            </Button>
            <Button onClick={handleStartGame} className="w-full">
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setup;