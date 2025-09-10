import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { Crown, ShieldX } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

const Results = () => {
  const { gameState, resetGame } = useGame();
  const { players, winner } = gameState;
  const navigate = useNavigate();

  React.useEffect(() => {
    if (gameState.gamePhase !== 'finished') {
      navigate('/');
    }
  }, [gameState.gamePhase, navigate]);

  if (gameState.gamePhase !== 'finished') {
    return null;
  }

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  if (!winner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Game Over!</CardTitle>
            <CardDescription>Unfortunately, no player met the winning conditions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ShieldX className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="mt-4">All players finished with a score over 100.</p>
            </div>
            <h3 className="text-xl font-semibold mb-4">Final Standings</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell className="text-right">{player.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={resetGame} className="w-full mt-6">
              Play Again
            </Button>
          </CardContent>
        </Card>
        <div className="absolute bottom-0">
          <MadeWithDyad />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Game Over!</CardTitle>
          <CardDescription>Congratulations to the winner!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Crown className="h-16 w-16 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-semibold mt-2">{winner.name}</h2>
            <p className="text-lg text-muted-foreground">Final Score: {winner.score}</p>
          </div>
          <h3 className="text-xl font-semibold mb-4">Final Standings</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player, index) => (
                <TableRow key={player.id} className={player.id === winner.id ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell className="text-right">{player.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={resetGame} className="w-full mt-6">
            Play Again
          </Button>
        </CardContent>
      </Card>
      <div className="absolute bottom-0">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Results;