package main

import (
	"fmt"
	"strconv"
)

var charMap = map[uint8]byte{
  0b010000: 'P',
  0b110000: '0',
  0b000001: 'A',
  0b010001: 'Q',
  0b110001: '1',
  0b000010: 'B',
  0b010010: 'R',
  0b110010: '2',
  0b000011: 'C',
  0b010011: 'S',
  0b110011: '3',
  0b000100: 'D',
  0b010100: 'T',
  0b110100: '4',
  0b000101: 'E',
  0b010101: 'U',
  0b110101: '5',
  0b000110: 'F',
  0b010110: 'V',
  0b110110: '6',
  0b000111: 'G',
  0b010111: 'W',
  0b110111: '7',
  0b001000: 'H',
  0b011000: 'X',
  0b111000: '8',
  0b001001: 'I',
  0b011001: 'Y',
  0b111001: '9',
  0b001010: 'J',
  0b011010: 'Z',
  0b001011: 'K',
  0b001100: 'L',
  0b001101: 'M',
  0b001110: 'N',
  0b001111: 'O',
}

func parseID(buf []byte) string {
	bitstream := ""

	for _, b := range buf[:6] {
		// Convert each byte to a binary string representation
		bitstream += fmt.Sprintf("%08b", b)
	}

	id := make([]byte, 0, 6)
	for i := 0; i < len(bitstream); i += 6 {
		val, err := strconv.ParseInt(bitstream[i:i+6], 2, 8)
		if err != nil {
			panic(err)
		}

		c, ok := charMap[uint8(val)]
		if ok {
			id = append(id, c)
		}
	}
  
	return string(id)
}

