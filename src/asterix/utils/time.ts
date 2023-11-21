export function secondsSinceMidnightToString(ssm?: number): string {
  if (ssm === null || ssm === undefined) {
    return ""
  }

  const date = new Date()

  date.setHours(0, 0, 0, 0) // Set to midnight
  date.setSeconds(ssm)

  // Format the time as HH:MM:SS
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const seconds = date.getSeconds().toString().padStart(2, "0")

  return `${hours}:${minutes}:${seconds}`
}
