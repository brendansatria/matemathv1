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

const qrCombinations = new Map<string, number>([
  ['qr_1,qr_2', 4], ['qr_1,qr_3', 6], ['qr_1,qr_4', 11], ['qr_1,qr_5', 0], ['qr_1,qr_6', -2], ['qr_1,qr_7', -4], ['qr_1,qr_8', -9], ['qr_1,qr_9', 1], ['qr_1,qr_10', 1], ['qr_1,qr_11', 11], ['qr_1,qr_12', -9],
  ['qr_2,qr_3', 8], ['qr_2,qr_4', 13], ['qr_2,qr_5', 2], ['qr_2,qr_6', 0], ['qr_2,qr_7', -2], ['qr_2,qr_8', -7], ['qr_2,qr_9', 3], ['qr_2,qr_10', 3], ['qr_2,qr_11', 13], ['qr_2,qr_12', -7],
  ['qr_3,qr_4', 15], ['qr_3,qr_5', 4], ['qr_3,qr_6', 2], ['qr_3,qr_7', 0], ['qr_3,qr_8', -5], ['qr_3,qr_9', 5], ['qr_3,qr_10', 5], ['qr_3,qr_11', 15], ['qr_3,qr_12', -5],
  ['qr_4,qr_5', 9], ['qr_4,qr_6', 7], ['qr_4,qr_7', 5], ['qr_4,qr_8', 0], ['qr_4,qr_9', 10], ['qr_4,qr_10', 10], ['qr_4,qr_11', 20], ['qr_4,qr_12', 0],
  ['qr_5,qr_6', -4], ['qr_5,qr_7', -6], ['qr_5,qr_8', -11], ['qr_5,qr_9', -1], ['qr_5,qr_10', -1], ['qr_5,qr_11', 9], ['qr_5,qr_12', -11],
  ['qr_6,qr_7', -8], ['qr_6,qr_8', -13], ['qr_6,qr_9', -3], ['qr_6,qr_10', -3], ['qr_6,qr_11', 7], ['qr_6,qr_12', -13],
  ['qr_7,qr_8', -15], ['qr_7,qr_9', -5], ['qr_7,qr_10', -5], ['qr_7,qr_11', 5], ['qr_7,qr_12', -15],
  ['qr_8,qr_9', -10], ['qr_8,qr_10', -10], ['qr_8,qr_11', 0], ['qr_8,qr_12', -20],
  ['qr_9,qr_10', 0], ['qr_9,qr_11', 10], ['qr_9,qr_12', -10],
  ['qr_10,qr_11', 10], ['qr_10,qr_12', -10],
  ['qr_11,qr_12', 0],
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

/**
 * Gets the numerical operation for a given pair of QR codes.
 * @param qrCode1 The first scanned QR code.
 * @param qrCode2 The second scanned QR code.
 * @returns The number to add/subtract, or null if the combination is invalid.
 */
export const getCombinationOperation = (qrCode1: string, qrCode2: string): number | null => {
  const sortedKeys = [qrCode1, qrCode2].sort();
  const key = sortedKeys.join(',');
  return qrCombinations.get(key) ?? null;
};