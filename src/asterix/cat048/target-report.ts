export enum TYP {
  NoDetection = 0,
  SinglePSRDetection,
  SingleSSRDetection,
  SSRPSRDetection,
  SingleModeSAllCall,
  SingleModeSRollCall,
  ModeSAllCallPSR,
  ModelSRollCallPSR
}

export function TYPtoString(value?: TYP): string {
  if (value === null || value === undefined) return 'N/A'

  switch (value) {
    case TYP.NoDetection:
      return 'No detection'
    case TYP.SinglePSRDetection:
      return 'Single PSR detection'
    case TYP.SingleSSRDetection:
      return 'Single SSR detection'
    case TYP.SSRPSRDetection:
      return 'SSR + PSR detection'
    case TYP.SingleModeSAllCall:
      return 'Single ModeS All-Call'
    case TYP.SingleModeSRollCall:
      return 'Single ModeS Roll-Call'
    case TYP.ModeSAllCallPSR:
      return 'ModeS All-Call + PSR'
    case TYP.ModelSRollCallPSR:
      return 'ModeS Roll-Call + PSR'
  }
}

export function SIMtoString(value?: boolean) {
  if (value === null || value === undefined) return 'N/A'

  return value ? 'Simulated target report'
               : 'Actual target report'
}

export function RDPtoString(value?: boolean) {
  if (value === null || value === undefined) return 'N/A'
  return value ? 'Report from RDP Chain 2'
               : 'Report from RDP Chain 1'
}

export function SPItoString(value?: boolean) {
  if (value === null || value === undefined) return 'N/A'

  return value ? 'Special Position Identification'
               : 'Absence of SPI'
}

export function RABtoString(value?: boolean) {
  if (value === null || value === undefined) return 'N/A'

  return value ? 'Report from field monitor (fixed transponder)'
               : 'Report from aircraft transponder'
}

export function TSTtoString(value?: boolean) {
  if (value === null || value === undefined) return 'N/A'

  return value ? 'Test target report'
               : 'Real target report'
}

export function ERRtoString(value?: boolean) {
  if (value === null || value === undefined) return 'N/A'
  
  return value ? 'No Extended Range'
               : 'Extended Range present'
}

export function XPPtoString(value?: boolean) {
  if (value === null || value === undefined) return 'N/A'

  return value ? 'X-Pulse present'
               : 'No X-Pulse present'
}

export function MEtoString(value?: boolean) {
  if (value === null || value === undefined) return 'N/A'

  return value ? 'Military emergency'
               : 'No military emergency'
}

export function MItoString(value?: boolean) {
  if (value === null || value === undefined) return 'N/A'

  return value ? 'Military identification'
               : 'No military identification'
}

export enum FOEFRI {
  NoMode = 0,
  Friendly,
  Unknown,
  NoReply,
}

export function FOEFRItoString(value?: FOEFRI) {
  if (value === null || value === undefined) return 'N/A'

  switch (value) {
    case FOEFRI.NoMode:
      return 'No Mode 4 interrogation'
    case FOEFRI.Friendly:
      return 'Friendly target'
    case FOEFRI.Unknown:
      return 'Unknown target'
    case FOEFRI.NoReply:
      return 'No reply'
  }
}