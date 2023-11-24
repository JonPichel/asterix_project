export enum TYP {
  NoDetection = 0,
  SinglePSRDetection,
  SingleSSRDetection,
  SSRPSRDetection,
  SingleModeSAllCall,
  SingleModeSRollCall,
  ModeSAllCallPSR,
  ModelSRollCallPSR,
}

export function TYPtoString(value?: TYP): string {
  if (value === null || value === undefined) return "N/A"

  switch (value) {
    case TYP.NoDetection:
      return "No detection"
    case TYP.SinglePSRDetection:
      return "Single PSR detection"
    case TYP.SingleSSRDetection:
      return "Single SSR detection"
    case TYP.SSRPSRDetection:
      return "SSR + PSR detection"
    case TYP.SingleModeSAllCall:
      return "Single ModeS All-Call"
    case TYP.SingleModeSRollCall:
      return "Single ModeS Roll-Call"
    case TYP.ModeSAllCallPSR:
      return "ModeS All-Call + PSR"
    case TYP.ModelSRollCallPSR:
      return "ModeS Roll-Call + PSR"
  }
}

export function SIMtoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "Simulated target report" : "Actual target report"
}

export function RDPtoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"
  return value ? "Report from RDP Chain 2" : "Report from RDP Chain 1"
}

export function SPItoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "Special Position Identification" : "Absence of SPI"
}

export function RABtoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value
    ? "Report from field monitor (fixed transponder)"
    : "Report from aircraft transponder"
}

export function TSTtoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "Test target report" : "Real target report"
}

export function ERRtoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "No Extended Range" : "Extended Range present"
}

export function XPPtoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "X-Pulse present" : "No X-Pulse present"
}

export function MEtoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "Military emergency" : "No military emergency"
}

export function MItoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "Military identification" : "No military identification"
}

export enum FOEFRI {
  NoMode = 0,
  Friendly,
  Unknown,
  NoReply,
}

export function FOEFRItoString(value?: FOEFRI) {
  if (value === null || value === undefined) return "N/A"

  switch (value) {
    case FOEFRI.NoMode:
      return "No Mode 4 interrogation"
    case FOEFRI.Friendly:
      return "Friendly target"
    case FOEFRI.Unknown:
      return "Unknown target"
    case FOEFRI.NoReply:
      return "No reply"
  }
}

export enum Typsensor {
  CombinedTrack = 0,
  PSRTrack,
  SSRModeSTrack,
  Invalid,
}

export function ConfirmedTentavitoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "Tentative Track" : "Confirmed Track"
}

export function TypsensortoString(value?: Typsensor) {
  if (value === null || value === undefined) return "N/A"

  switch (value) {
    case Typsensor.CombinedTrack:
      return "Combined Track"
    case Typsensor.PSRTrack:
      return "PSSR Track"
    case Typsensor.SSRModeSTrack:
      return "SSR/Mode S Track"
    case Typsensor.Invalid:
      return "Invalid"
  }
}
export function SignalsLevelsConfidencetoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value
    ? "Low confidence in plot to track association"
    : "Normal confidence"
}
export function ManoeuvreDetectiontoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "Horizontal man.sensed" : "No horizontal man.sensed"
}
export enum typClimbingMode {
  Maintaining = 0,
  Climbing,
  Descending,
  Unknown,
}
export function ClimbingDescendingtoString(value?: typClimbingMode) {
  if (value === null || value === undefined) return "N/A"
  //DUDA: Al profe no le da infrmacion de este valor pero a nosotros si que nos dice lo de climbing y esas cosas
  switch (value) {
    case typClimbingMode.Maintaining:
      return "Maintaining"
    case typClimbingMode.Climbing:
      return "Climbing"
    case typClimbingMode.Descending:
      return "Descending"
    case typClimbingMode.Unknown:
      return "Unknown"
  }
}
export function TREtoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "End of track lifetime" : "Track still alive"
}
export function GHOtoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "Ghost target track" : "True target track"
}
export function SUPtoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value ? "yes" : "no"
}
export function TCCtoString(value?: boolean) {
  if (value === null || value === undefined) return "N/A"

  return value
    ? "Reference plane,tangential to the Earth modelat the radar site co-ordinates"
    : "Radar plane"
}
