type GPSCoords = {
  lat: number
  lon: number
  alt: number
}

type PolarCoords = {
  rho: number
  theta: number
  z: number
}

type CartesianCoords = {
  x: number
  y: number
  z: number
}

function getRadarCoords(sac: number, sic: number): GPSCoords {
  if (sac == 0x14 && sic == 0x81) {
    return { lat: 41.3007023, lon: 2.1020588, alt: 2 + 25.25 }
  } else {
    throw Error("Unknown radar")
  }
}

export function polarToGPS(origin: GPSCoords, polar: PolarCoords): GPSCoords {
  return origin
}

class Matrix {
  private rows: number
  private cols: number
  private values: number[][]

  constructor(rows: number, cols: number, values?: number[][]) {
    if (values === null || values === undefined) {
      this.rows = rows
      this.cols = cols
      this.values = Array.from({ length: this.rows }, () =>
        Array(this.cols).fill(0)
      )
      return
    }
    if (values.length !== rows)
      throw Error("Bad matrix dimensions (number of rows)")

    for (const row of values) {
      if (row.length !== cols)
        throw Error("Bad matrix dimensions (number of cols)")
    }

    this.rows = rows
    this.cols = cols
    this.values = values
  }

  transpose(): Matrix {
    const transposed = new Matrix(this.cols, this.rows, this.values)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        transposed.values[j][i] = this.values[i][j]
      }
    }
    return transposed
  }

  multiply(other: Matrix): Matrix {
    if (this.cols !== other.rows) {
      throw Error("Incompatible dimensions for matrix multiplication")
    }
    const result = new Matrix(this.rows, other.cols)

    for (let row = 0; row < result.rows; row++) {
      for (let col = 0; col < result.cols; col++) {
        for (let i = 0; i < this.cols; i++) {
          result.values[row][col] += this.values[row][i] * other.values[i][col]
        }
      }
    }

    return result
  }

  add(other: Matrix): Matrix {
    if (this.rows != other.rows || this.cols != other.cols) {
      throw Error("Incompatible dimensions for matrix addition")
    }

    const result = new Matrix(this.rows, this.cols, this.values)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.values[i][j] += other.values[i][j]
      }
    }

    return result
  }

  get(row: number, col: number): number {
    return this.values[row][col]
  }
}

export class RadarPosition {
  private rotationMatrix: Matrix
  private translationMatrix: Matrix
  coords: GPSCoords

  constructor(coords: GPSCoords) {
    this.coords = coords
    this.rotationMatrix = this.getRotationMatrix()
    this.translationMatrix = this.getTranslationMatrix()
  }

  getRotationMatrix() {
    const lat = (this.coords.lat * Math.PI) / 180.0
    const lon = (this.coords.lon * Math.PI) / 180.0

    return new Matrix(3, 3, [
      [-Math.sin(lon), Math.cos(lon), 0],
      [
        -Math.sin(lat) * Math.cos(lon),
        -Math.sin(lat) * Math.sin(lon),
        Math.cos(lat),
      ],
      [
        Math.cos(lat) * Math.cos(lon),
        Math.cos(lat) * Math.sin(lon),
        Math.sin(lat),
      ],
    ])
  }

  getTranslationMatrix() {
    const a = 6378137
    const e2 = 0.00669437999013
    const lat = (this.coords.lat * Math.PI) / 180.0
    const lon = (this.coords.lon * Math.PI) / 180.0
    const alt = this.coords.alt
    const nu = a / Math.sqrt(1 - e2 * Math.pow(Math.sin(lat), 2))

    return new Matrix(3, 1, [
      [(nu + alt) * Math.cos(lat) * Math.cos(lon)],
      [(nu + alt) * Math.cos(lat) * Math.sin(lon)],
      [(nu * (1 - e2) + alt) * Math.sin(lat)],
    ])
  }

  cartesianToGPS(cartesian: CartesianCoords): GPSCoords {
    const inputMatrix = new Matrix(3, 1, [
      [cartesian.x, cartesian.y, cartesian.z],
    ])
    const outputMatrix = this.rotationMatrix
      .transpose()
      .multiply(inputMatrix)
      .add(this.translationMatrix)
    return {
      lat: outputMatrix.get(0, 0),
      lon: outputMatrix.get(1, 0),
      alt: outputMatrix.get(2, 0),
    }
  }
}
/*
export function cartesianToGPS(origin: GPSCoords, cartesian: CartesianCoords): GPSCoords {
  //at_radar_local_to_geocentric
  GeneralMatrix translationMatrix = ObtainTranslationMatrix(radarCoordinates);
  GeneralMatrix rotationMatrix = ObtainRotationMatrix(radarCoordinates);

  double[][] coefInput = { new double[1], new double[1], new double[1] };
  coefInput[0][0] = cartesianCoordinates.X;
  coefInput[1][0] = cartesianCoordinates.Y;
  coefInput[2][0] = cartesianCoordinates.Z;
  GeneralMatrix inputMatrix = new GeneralMatrix(coefInput, 3, 1);

  GeneralMatrix R1 = rotationMatrix.Transpose();
  GeneralMatrix R2 = R1.Multiply(inputMatrix);
  R2.AddEquals(translationMatrix);

  CoordinatesXYZ res = new CoordinatesXYZ(R2.GetElement(0, 0),
                          R2.GetElement(1, 0),
                          R2.GetElement(2, 0));
  return res;
  return origin
}
*/
