type GPSCoords = {
  lat: number;
  lon: number;
  alt: number;
}

type PolarCoords = {
  rho: number;
  theta: number;
  z: number;
}

type CartesianCoords = {
  x: number;
  y: number;
  z: number;
}

function getRadarCoords(sac: number, sic: number): GPSCoords {
  if (sac == 0x14 && sic == 0x81) {
    return { lat: 41.3007023, lon: 2.1020588, alt: 2.007 + 25.25 }
  } else {
    throw Error("Unknown radar")
  }
}

export function polarToGPS(origin: GPSCoords, polar: PolarCoords): GPSCoords {
  return origin

}

class Matrix {
  private rows: number;
  private cols: number;
  private values: number[][];

  constructor(rows: number, cols: number, values?: number[][]) {
    if (values === null || values === undefined) {
      this.rows = rows
      this.cols = cols
      this.values = Array.from({ length: this.rows }, () => Array(this.cols).fill(0))
      return
    }
    if (values.length !== rows) throw Error("Bad matrix dimensions (number of rows)")

    for (const row of values) {
      if (row.length !== cols) throw Error("Bad matrix dimensions (number of cols)")
    }

    this.rows = rows
    this.cols = cols
    this.values = values
  }

  transpose(): Matrix {
    let transposed = new Matrix(this.cols, this.rows, this.values)
    for (let i = 0; i < this.rows; i++)
    {
      for (let j = 0; j < this.cols; j++)
      {
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
}
export class RadarPosition {
  private rotationMatrix: number[][]; 
  private translationMatrix: number[][]; 
  coords: GPSCoords; 

  constructor(coords: GPSCoords) {
    this.rotationMatrix = []
    this.translationMatrix = []
    this.coords = coords
  }

  cartesianToGPS(cartesian: CartesianCoords): GPSCoords {
    return this.coords
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