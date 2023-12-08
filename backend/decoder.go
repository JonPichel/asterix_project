package main

import "log"

func DecodeFile(buf []byte) []DataRecord048 {
	records := make([]DataRecord048, 0)
	stop := false
	for i := 0; i < len(buf) && !stop; {
		cat := buf[i]
		len := (int(buf[i + 1]) << 8) | int(buf[i + 2])
		data := buf[i + 3:i + len]

		switch cat {
		case 48:
			r, err := New048(data)
			if err != nil {
				continue
			}

			records = append(records, r)
		default:
			log.Printf("Data Record Category not implemented: %d", cat)
			stop = true
		}

		i += len
	}

	return records
}