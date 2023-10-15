export function ValidatedtoString(value?: boolean) {
  if (value === null || value === undefined) return ''

  return value ? 'Code validated'
               : 'Code not validated'
}

export function GarbledtoString(value?: boolean) {
  if (value === null || value === undefined) return ''

  return value ? 'Garbled'
               : 'Default code'
}