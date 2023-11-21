
export interface ResultFX {
  positions: number[];
  fieldLength: number;
}

export function checkFX(buffer: Uint8Array): ResultFX {
  // Check FX bit of each byte until it is not set
  let fieldLength = 1
  while ((buffer[fieldLength-1] & 0b1) === 1) {
    fieldLength++
  }

  // Build an array with the bit positions that are set to 1
  const positions = []
  for (let i = 0; i < fieldLength; i++) {
    for (let j = 0; j < 7; j++) {
      if ((buffer[i] >> (7 - j) & 0b1) === 1) {
        positions.push(7*i + j + 1)
      }
    }
  }

  return {
    positions,
    fieldLength
  } as ResultFX
}

export function octalToDecimal(octal: number, numDigits: number): number {
  let decimal = 0
  for (let digit = numDigits - 1; digit >= 0; digit--) {
    decimal += ((octal >> (3*digit)) & 0b111) * Math.pow(8, digit)
  }
  return decimal
}

export function twosComplement(value: number, numBits: number): number {
  if ((value >> (numBits - 1)) === 1) {
    // Negative value
    return ~value + 1
  } else {
    // Positive value
    return value
  }
}