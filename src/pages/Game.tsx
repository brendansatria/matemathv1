import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useNavigate } from 'react-router-dom';

const Game = () => {
  const { gameState, nextTurn } = useGame();
  const { players, round, currentPlayerIndex } = gameState;
  const navigate = useNavigate();

  React.useEffect(() => {
    if (players.length === 0) {
      navigate('/');
    }
  }, [players, navigate]);

  if (players.length === 0) {
    return null; // or a loading spinner
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Mate-Math</h1>
        <p className="text-xl text-muted-foreground">Round {round}</p>
      </header>

      <main className="flex-grow">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {players.map((player) => (
            <Card key={player.id} className={player.id === currentPlayer.id ? 'border-primary ring-2 ring-primary' : ''}>
              <CardHeader className="p-4">
                <CardTitle>{player.name}</CardTitle>
                <CardDescription>Numbers: {player.number}</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-3xl font-bold">{player.score}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center p-6 bg-card rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">It's {currentPlayer.name}'s turn!</h2>
          <p className="text-muted-foreground">Scan a QR code to make your move.</p>
          <Button onClick={nextTurn} className="mt-4">
            Next Player (Temporary)
          </Button>
        </div>
      </main>
      
      <footer className="mt-8">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Game;