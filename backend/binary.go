package main

import "math"

type resultFX struct {
	positions []uint8
	fieldLen int
}

func checkFX(buf []uint8) resultFX {
  // Check FX bit of each byte until it is not set
  fieldLen := 1

  for (buf[fieldLen-1] & 0b1) == 1{
	fieldLen++
  }

  // Build an array with the bit positions that are set to 1
  positions := make([]uint8, 0)

  for i := 0; i < fieldLen; i++ {
	for j := 0; j < 7; j++ {
		if ((buf[i] >> (7 - j)) & 0b1) == 1 {
			positions = append(positions, uint8(7*i+j+1))
		}
	}
  }

  return resultFX{positions, fieldLen}
}

func octalToDecimal(octal uint64, numDigits uint8) uint64 {
  decimal := uint64(0)

  for digit := int(numDigits) - 1; digit >= 0; digit-- {
    decimal += ((octal >> (3 * digit)) & 0b111) * uint64(math.Pow(8, float64(digit)))
  }

  return decimal
}

func twosComplement(value uint64, numBits uint8) int64 {
	mask := uint64((1 << numBits) - 1)
	maskedValue := value & mask
	if (maskedValue >> (numBits - 1) == 1) {
		return -int64((^maskedValue + 1) & mask)
	} else {
		return int64(value)
	}
}