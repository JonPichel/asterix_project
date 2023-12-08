package main

import (
	"sort"
	"time"
)
type Point struct {
	Timestamp int64 `json:"timestamp"`
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
	Alt float64 `json:"alt"`
}

type Aircraft struct {
	ID string `json:"id"`
	Route []Point `json:"route"`
}

type ByTime []Point
func (a ByTime) Len() int { return len(a) }
func (a ByTime) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByTime) Less(i, j int) bool { return a[i].Timestamp < a[j].Timestamp }

func parseAircrafts(records []DataRecord048) []Aircraft {
	aircrafts := make([]Aircraft, 0)
	ids := make(map[string]int, 0)
	for _, r := range records {
		if !r.Has220 || !r.Has140 || !r.HasCoords {
			continue
		}

		id := r.AircraftAddress 
		lat := r.Coords.Lat
		lon := r.Coords.Lon
		alt := r.Coords.Alt
		
		acIndex, ok := ids[id]
		if !ok {
			acIndex = len(aircrafts)
			ids[id] = acIndex
			aircrafts = append(aircrafts, Aircraft{
				ID: id,
				Route: make([]Point, 0),
			})
		}

		duration := time.Duration(r.SecondsSinceMidnight*1000 * float32(time.Millisecond))
		now := time.Now()
		midnight := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local)
		resultTime := midnight.Add(duration)
		timestamp := resultTime.UnixMilli()
		aircrafts[acIndex].Route = append(aircrafts[acIndex].Route, Point{
			Timestamp: timestamp,
			Lat: lat,
			Lon: lon,
			Alt: alt,
		})
	}

	for i := range aircrafts {
		sort.Sort(ByTime(aircrafts[i].Route))
	}

	return aircrafts
}