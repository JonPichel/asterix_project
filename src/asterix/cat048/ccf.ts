export enum COM {
    NoCom = 0,
    CaCbCap,
    CaCbUp,
    CaCbUpDown,
    L5TC,
    NotAssig5,
    NotAssig6,
    NotAssig7
}
  
export function COMtoString(value?: COM): string {
    if (value === null || value === undefined) return 'N/A'

    // DUDA: EN SU PROGRAMA ESTA AL REVÉS
    switch (value) {
        case COM.NoCom:
        return 'No communications capability (surveillance only)'
        case COM.CaCbCap:
        return 'Comm. A and Comm. B capability'
        case COM.CaCbUp:
        return 'Comm. A and Comm. B capability and Uplink ELM'
        case COM.CaCbUpDown:
        return 'Comm. A and Comm. B capability and Uplink ELM and Downlink ELM'
        case COM.L5TC:
        return 'Level 5 Transponder capability'
        case COM.NotAssig5:
        case COM.NotAssig6:
        case COM.NotAssig7:
        return 'Not assigned'
    }
}

export enum STAT {
    NaNsAa = 0,
    NaNsAg,
    ANsAa,
    ANsAg,
    ASAag,
    NaSAag,
    NotAssig6,
    unk
}

export function STATtoString(value?: STAT): string {
    if (value === null || value === undefined) return 'N/A'

    // DUDA: EN SU PROGRAMA ESTA AL REVÉS
    switch (value) {
        case STAT.NaNsAa:
            return 'No alert, no SPI, aircraft airborne'
        case STAT.NaNsAg:
            return 'No alert, no SPI, aircraft on ground'
        case STAT.ANsAa:
            return 'Alert, no SPI, aircraft airborne'
        case STAT.ANsAg:
            return 'Alert, no SPI, aircraft on ground'
        case STAT.ASAag:
            return 'Alert, SPI, aircraft airborne or on ground'
        case STAT.NaSAag:
            return 'No alert, SPI, aircraft airborne or on ground'
        case STAT.NotAssig6:
            return 'Not assigned'
        case STAT.unk:
            return 'Unknown'
    }
}


export function SItoString(value?: boolean) {
    if (value === null || value === undefined) return 'N/A'

    return value ? 'II-Code Capable'
    : 'SI-Code Capable'
}

export function MSSCtoString(value?:boolean) {
    if (value === null || value === undefined) return 'N/A'

    return value ? 'Yes'
    : 'No'
}

export function ARCtoString(value?:boolean) {
    if (value === null || value === undefined) return 'N/A'

    // DUDA: EN SU PROGRAMA ESTA AL REVÉS
    return value ? '25 ft resolution'
    : '100 ft resolution'
}

export function AICtoString(value?:boolean) {
    if (value === null || value === undefined) return 'N/A'

    // DUDA: EN SU PROGRAMA ESTA AL REVÉS
    return value ? 'Yes'
    : 'No'
}
  