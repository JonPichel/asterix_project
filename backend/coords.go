package main

import (
	"errors"
	"math"
)

type GPSCoords struct {
	Lat float64
	Lon float64
	Alt float64
}

type SlantCoords struct {
	Rho float32
	Theta float32
	Alt float64
}

type CartesianCoords struct {
	X float64
	Y float64
	Z float64
}

type Radar struct {
	SAC, SIC uint8
	rotationMatrix Matrix
	translationMatrix Matrix
	coords GPSCoords
}

func NewRadar(SAC, SIC uint8) (*Radar, error) {

	var r Radar
	if SAC == 0x14 && SIC == 0x81 {
		r = Radar{
			SAC: SAC,
			SIC: SIC,
			coords: GPSCoords{Lat: 41.3007023, Lon: 2.1020588, Alt: 2.007 + 25.25},
		}
	} else {
		return nil, errors.New("unknown radar")
	}

	r.computeRotationMatrix()
	r.computeTranslationMatrix()

	return &r, nil
}

func (r *Radar) computeRotationMatrix() {
	lat := r.coords.Lat * math.Pi / 180
	lon := r.coords.Lon * math.Pi / 180

	sinLon := math.Sin(lon)
	cosLon := math.Cos(lon)
	sinLat := math.Sin(lat)
	cosLat := math.Cos(lat)
	r.rotationMatrix, _ = NewMatrix(3, 3, []float64{
		-sinLon, cosLon, 0,
        -sinLat * cosLon, -sinLat * sinLon, cosLat,
        cosLat * cosLon, cosLat * sinLon, sinLat,
	})
}

func (r *Radar) computeTranslationMatrix() {
	a := float64(6378137)
	e2 := 0.00669437999013
	lat := r.coords.Lat * math.Pi / 180.0
	lon := r.coords.Lon * math.Pi / 180.0
	alt := r.coords.Alt
	nu := a / math.Sqrt(1 - e2 * math.Pow(math.Sin(lat), 2))

	r.translationMatrix, _ = NewMatrix(3, 1, []float64{
		(nu + alt) * math.Cos(lat) * math.Cos(lon),
		(nu + alt) * math.Cos(lat) * math.Sin(lon),
		(nu * (1 - e2) + alt) * math.Sin(lat),
	})
}

func (r Radar) SlantToGPS(slant SlantCoords) GPSCoords {
	a := float64(6378137)
	rho := float64(slant.Rho)
	theta := float64(slant.Theta * math.Pi / 180)
	H := slant.Alt
	h := r.coords.Alt
	elevation := math.Asin(
		(2 * a * (H - h) + H * H - h * h - rho*rho) /
        (2 * rho * (a + h)),
    )

	cartesian := CartesianCoords{
		X: rho * math.Sin(theta) * math.Cos(elevation),
		Y: rho * math.Cos(theta) * math.Cos(elevation),
		Z: rho * math.Sin(elevation),
	}

	return r.CartesianToGPS(cartesian)
}

func (r Radar) CartesianToGPS(cartesian CartesianCoords) GPSCoords {
	input, _ := NewMatrix(3, 1, []float64{
		cartesian.X, cartesian.Y, cartesian.Z,
	})

	aux, _ := r.rotationMatrix.Transpose().Multiply(input)
	output, _ := aux.Add(r.translationMatrix)

	x := output.values[0]
	y := output.values[1]
	z := output.values[2]

	a := float64(6378137)
    e2 := 0.00669437999013
    dXY := math.Sqrt(x * x + y * y)

    lat := math.Atan(z / dXY / (1 - (a * e2) / math.Sqrt(dXY * dXY + z * z)))
    nu := a / math.Sqrt(1 - e2 * math.Pow(math.Sin(lat), 2))
    height := dXY / math.Cos(lat) - nu

	var latOver float64
	if lat >= 0 {
		latOver = -0.1
	} else {
		latOver = 0.1
	}

    count := 0
	for math.Abs(lat - latOver) > 1e-8 && count < 50 {
		count++
		latOver = lat
		lat = math.Atan((z * (1 + height / nu)) / (dXY * (1 - e2 + height / nu)))
		nu = a / math.Sqrt(1 - e2 * math.Pow(math.Sin(lat), 2))
		height = dXY / math.Cos(lat) - nu
	}

    lon := math.Atan2(y, x)

	return GPSCoords{
		Lat: lat * 180 / math.Pi,
		Lon: lon * 180 / math.Pi,
		Alt: height,
	}
}