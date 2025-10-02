const round1And2Operations = new Map<string, number>([
  ['qr_1', 1],
  ['qr_2', 3],
  ['qr_3', 5],
  ['qr_4', 10],
  ['qr_5', -1],
  ['qr_6', -3],
  ['qr_7', -5],
  ['qr_8', -10],
  ['qr_9', 0],
  ['qr_10', 0],
  ['qr_11', 10],
  ['qr_12', -10],
]);

/**
 * Gets the numerical operation for a given QR code and round.
 * @param qrCode The text from the scanned QR code (e.g., 'qr_1').
 * @param round The current game round.
 * @returns The number to add/subtract, or null if the code is invalid for the round.
 */
export const getOperationForQrCode = (qrCode: string, round: number): number | null => {
  // Rounds 1 & 2: Standard operations
  if (round >= 1 && round <= 2) {
    return round1And2Operations.get(qrCode) ?? null;
  }

  // Round 3: Inverted operations
  if (round === 3) {
    const baseValue = round1And2Operations.get(qrCode);
    if (baseValue !== undefined && baseValue !== null) {
      return baseValue * -1; // Invert the value
    }
    return null;
  }
  
  // No operations are defined for other rounds yet.
  return null;
};