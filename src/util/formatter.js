import { DateTime } from 'luxon'
export const colours = [
  '#0c6ba2',
  '#0dacde',
  '#23036c',
  '#7f37bb',
  '#b149cf',
  '#db4bb7',
  '#d66790',
  '#ea7369',
  '#19e5bf',
  '#17d6d5'
]

export const formatAsDateTime = timeMilliseconds => {
  if (typeof timeMilliseconds !== 'number') return
  const parsedTime = DateTime.fromMillis(timeMilliseconds)

  return parsedTime.toLocaleString({
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const tooltipValueFormatter = (value, name, props) => {
  return [value.toFixed(2), name, props.unit]
}

export const tooltipLabelFormatter = (value, name, props) => {
  if (typeof value !== 'number') return value

  const parsedTime = DateTime.fromMillis(value)

  return parsedTime.toLocaleString({
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: '2-digit'
  })
}

export const getFirstUpperCaseString = (norStr) => {
  if (!norStr) return ''
  let firstUpperStr = norStr.charAt(0).toUpperCase() + norStr.slice(1).toLowerCase()
  return firstUpperStr
}
export const getCombinedUnits = (metadata) => {
  let unit = getFirstUpperCaseString(metadata.basePrefix)
    + getFirstUpperCaseString(metadata.unit)
    + '/'
    + getFirstUpperCaseString(metadata.perUnit)
  return unit
}

export const getCombinedUnitsForLegend = (metadata) => {
  let unit = '[' + getCombinedUnits(metadata) + ']'
  return unit
}
