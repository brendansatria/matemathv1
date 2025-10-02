import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import QrScanner from '@/components/QrScanner';
import { showSuccess, showError } from '@/utils/toast';
import { getOperationForQrCode, getCombinationOperation } from '@/lib/qr-operations';

const Game = () => {
  const { gameState, applyOperation } = useGame();
  const { players, round, currentPlayerIndex, gamePhase, pendingQrCode } = gameState;
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  React.useEffect(() => {
    if (players.length === 0 && gamePhase !== 'setup') {
      navigate('/');
    }
    if (gamePhase === 'finished') {
      navigate('/results');
    }
  }, [players, gamePhase, navigate]);

  if (gamePhase !== 'playing') {
    return null; // or a loading spinner
  }

  const currentPlayer = players[currentPlayerIndex];

  const handleScanSuccess = (decodedText: string) => {
    const isCombinationRound = round >= 4 && round <= 5;

    if (isCombinationRound) {
      if (!pendingQrCode) {
        showSuccess(`First code scanned: ${decodedText}. Scan another.`);
      } else if (pendingQrCode === decodedText) {
        showError("You can't scan the same QR code twice. Your turn has been reset.");
      } else {
        const value = getCombinationOperation(pendingQrCode, decodedText);
        if (value !== null) {
          const sign = value >= 0 ? '+' : '';
          showSuccess(`Combination successful! Applied: ${sign}${value}.`);
        } else {
          showError("Invalid combination. Your turn has been reset.");
        }
      }
    } else {
      const value = getOperationForQrCode(decodedText, round);
      if (value !== null) {
        const sign = value >= 0 ? '+' : '';
        showSuccess(`Applied: ${sign}${value}. Next player's turn!`);
      } else {
        showError(`Invalid QR code for this round: ${decodedText}`);
      }
    }
    
    applyOperation(decodedText);
    setIsScanning(false);
  };

  const turnPrompt = () => {
    if (round >= 4 && round <= 5) {
      if (pendingQrCode) {
        return `First code (${pendingQrCode}) scanned. Now scan the second code.`;
      }
      return `It's ${currentPlayer.name}'s turn! Scan your first QR code.`;
    }
    return `It's ${currentPlayer.name}'s turn!`;
  };

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
          <h2 className="text-2xl font-semibold mb-4">{turnPrompt()}</h2>
          
          {isScanning ? (
            <div>
              <p className="text-muted-foreground mb-4">Point your camera at a QR code.</p>
              <QrScanner onScanSuccess={handleScanSuccess} />
              <Button variant="outline" onClick={() => setIsScanning(false)} className="mt-4">
                Cancel
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground">Click the button to scan a QR code and make your move.</p>
              <Button onClick={() => setIsScanning(true)} className="mt-4">
                Scan QR Code
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Game;