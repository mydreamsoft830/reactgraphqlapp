import { DateTime } from 'luxon'

const Date = ({ time }) => {
  if (!time) return null

  const parsedTime = DateTime.fromMillis(time)

  return (
    <time dateTime={parsedTime.toJSON()}>
      {parsedTime.toLocaleString(DateTime.DATETIME_MED)}
    </time>
  )
}

export const DateWithSeconds = ({ time }) => {
  if (!time) return null

  const parsedTime = DateTime.fromMillis(time)

  return (
    <time dateTime={parsedTime.toJSON()}>
      {parsedTime.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
    </time>
  )
}

export default Date
