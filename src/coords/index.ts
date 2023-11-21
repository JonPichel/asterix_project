export type GPSCoords = {
  lat: number
  lon: number
  alt: number
}

export type PolarCoords = {
  rho: number
  theta: number
  z: number
}

export type CartesianCoords = {
  x: number
  y: number
  z: number
}

export function getRadarCoords(sac: number, sic: number): GPSCoords {
  if (sac == 0x14 && sic == 0x81) {
    return { lat: 41.3007023, lon: 2.1020588, alt: 2.007 + 25.25 }
  } else {
    throw Error("Unknown radar")
  }
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
    const transposed = new Matrix(this.cols, this.rows)
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

  polarToGPS(polar: PolarCoords): GPSCoords {
    const cartesian: CartesianCoords = {
      x: polar.rho * Math.sin(polar.theta),
      y: polar.rho * Math.cos(polar.theta),
      z: polar.z,
    }
    return this.cartesianToGPS(cartesian)
  }

  cartesianToGPS(cartesian: CartesianCoords): GPSCoords {
    // Cartesian to geocentric
    const inputMatrix = new Matrix(1, 3, [
      [cartesian.x, cartesian.y, cartesian.z],
    ]).transpose()
    const outputMatrix = this.rotationMatrix
      .transpose()
      .multiply(inputMatrix)
      .add(this.translationMatrix)

    const x = outputMatrix.get(0, 0)
    const y = outputMatrix.get(1, 0)
    const z = outputMatrix.get(2, 0)

    // Geocentric to geodesic
    const a = 6378137
    const e2 = 0.00669437999013
    const d_xy = Math.sqrt(x * x + y * y)

    let lat = Math.atan(
      z / d_xy / (1 - (a * e2) / Math.sqrt(d_xy * d_xy + z * z))
    )
    let nu = a / Math.sqrt(1 - e2 * Math.pow(Math.sin(lat), 2))
    let height = d_xy / Math.cos(lat) - nu

    let lat_over = lat >= 0 ? -0.1 : 0.1

    let loop_count = 0
    while (Math.abs(lat - lat_over) > 1e-8 && loop_count < 50) {
      loop_count++
      lat_over = lat
      lat = Math.atan((z * (1 + height / nu)) / (d_xy * (1 - e2 + height / nu)))
      nu = a / Math.sqrt(1 - e2 * Math.pow(Math.sin(lat), 2))
      height = d_xy / Math.cos(lat) - nu
    }
    const lon = Math.atan2(y, x)

    return {
      lat: (lat * 180) / Math.PI,
      lon: (lon * 180) / Math.PI,
      alt: height,
    }
  }
}
