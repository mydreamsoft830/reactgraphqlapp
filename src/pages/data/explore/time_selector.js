import Select, { components } from 'react-select'
import { useExploreContext, timeValueToMs } from './explore_context'
import { AiFillBackward, AiFillForward, AiFillCaretRight } from 'react-icons/ai'
import { CgPlayPause } from 'react-icons/cg'
import { VscGraph } from 'react-icons/vsc'
import { ImTable2 } from 'react-icons/im'
import { DateTime } from 'luxon'

const TimePeriodButtons = () => {
  const { timeOffset, skipTimePeriod, setTimeOffset } = useExploreContext()

  return (
    <div className="time-select-buttons">
      <div onClick={() => skipTimePeriod(-1)}>
        <AiFillBackward />
      </div>
      <div
        className={timeOffset === 0 ? 'active' : ''}
        onClick={() => setTimeOffset(0)}
      >
        {timeOffset === 0 ? <CgPlayPause /> : <AiFillCaretRight />}
      </div>
      <div
        className={timeOffset === 0 ? 'disabled' : ''}
        onClick={() => skipTimePeriod(1)}
      >
        <AiFillForward />
      </div>
    </div>
  )
}

const GraphSelectButtons = () => {
  const { resultsDisplayType, setResultsDisplayType } = useExploreContext()

  return (
    <div className="time-select-buttons">
      <div
        className={resultsDisplayType === 'graph' ? 'active' : null}
        onClick={() => setResultsDisplayType('graph')}
      >
        <VscGraph />
      </div>
      <div
        className={resultsDisplayType === 'table' ? 'active' : null}
        onClick={() => setResultsDisplayType('table')}
      >
        <ImTable2 />
      </div>
    </div>
  )
}

const SingleValue = ({ children, ...props }) => {
  const { timePeriod, timeOffset } = useExploreContext()

  let text = children

  if (timeOffset < 0) {
    const startTime = Date.now() + timeOffset
    const endTime = startTime - timeValueToMs(timePeriod)

    const startText = DateTime.fromMillis(startTime).toLocaleString({
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    const endText = DateTime.fromMillis(endTime).toLocaleString({
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

    text = (
      <>
        <div className="custom-time">
          {endText} - {startText}
        </div>
      </>
    )
  }

  return <components.SingleValue {...props}>{text}</components.SingleValue>
}

const Control = ({ children, ...props }) => {
  const { timePeriod } = useExploreContext()

  return (
    <components.Control {...props}>
      <span className="time-select-period">{timePeriod.value}</span>

      {children}
    </components.Control>
  )
}

export const TimeSelector = () => {
  const { timePeriod, setTimePeriod, timeOptions } = useExploreContext()

  return (
    <div className="time-select">
      <div className="select">
        <Select
          className='react-select-container'
          classNamePrefix="react-select"
          defaultValue={timePeriod}
          onChange={setTimePeriod}
          options={timeOptions}
          components={{ Control, SingleValue }}
        />
      </div>
      <TimePeriodButtons />
      <GraphSelectButtons />
    </div>
  )
}
