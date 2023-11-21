export function BDStoString(value: number) {
  const bds1 = (value >> 4) & 0b1111
  const bds2 = value & 0b1111
  return `BDS ${bds1},${bds2}`
}

export enum MCPFCUMode {
  None = 0,
  Approach,
  AltHold,
  AltHoldApproach,
  VNAV,
  VNAVApproach,
  VNAVAltHold,
  VNAVAltHoldApproach,
}

export function MCPFCUModetoString(value?: MCPFCUMode): string {
  if (value === null || value === undefined) return ""

  switch (value) {
    case MCPFCUMode.None:
      return "None"
    case MCPFCUMode.Approach:
      return "Approach"
    case MCPFCUMode.AltHold:
      return "Alt Hold"
    case MCPFCUMode.AltHoldApproach:
      return "Alt Hold + Approach"
    case MCPFCUMode.VNAV:
      return "VNAV"
    case MCPFCUMode.VNAVApproach:
      return "VNAV + Approach"
    case MCPFCUMode.VNAVAltHold:
      return "VNAV + Alt Hold"
    case MCPFCUMode.VNAVAltHoldApproach:
      return "VNAV + Alt Hold + Approach"
  }
}

export enum TargetAltSource {
  Unknown = 0,
  Aircraft,
  FCUMCP,
  FMS,
}

export function TargetAltSourcetoString(value?: TargetAltSource): string {
  if (value === null || value === undefined) return ""

  switch (value) {
    case TargetAltSource.Unknown:
      return "Unknown"
    case TargetAltSource.Aircraft:
      return "Aircraft altitude"
    case TargetAltSource.FCUMCP:
      return "FCU/MCP selected altitude"
    case TargetAltSource.FMS:
      return "FMS selected altitude"
  }
}
