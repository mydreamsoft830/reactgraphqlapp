import Select, { components } from 'react-select'
import { AiFillBackward, AiFillForward, AiFillCaretRight } from 'react-icons/ai'
import { CgPlayPause } from 'react-icons/cg'
import { VscGraph } from 'react-icons/vsc'
import { ImTable2 } from 'react-icons/im'
import { DateTime } from 'luxon'
import { timeOptions, timeValueToMs } from 'util/timeseries'
import './time_selector.scss'

export const TimeSelector = props => {
  const {
    timePeriod,
    setTimePeriod,
    timeOffset,
    setTimeOffset,
    skipTimePeriod,
    resultsDisplayType,
    setResultsDisplayType
  } = props

  const Control = ({ children, ...props }) => {
    return (
      <components.Control {...props}>
        <span className='time-select-period'>{timePeriod.value}</span>
        {children}
      </components.Control>
    )
  }

  const SingleValue = ({ children, ...props }) => {
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
          <div className='custom-time'>
            {endText} - {startText}
          </div>
        </>
      )
    }

    return <components.SingleValue {...props}>{text}</components.SingleValue>
  }

  const TimePeriodButtons = () => {
    return (
      <div className='time-select-buttons'>
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
    return (
      <div className='time-select-buttons'>
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

  return (
    <div className='time-select'>
      <div className='select'>
        <Select
          className='react-select-container'
          classNamePrefix='react-select'
          timePeriod={timePeriod}
          defaultValue={timePeriod}
          onChange={setTimePeriod}
          options={timeOptions}
          components={{ Control, SingleValue }}
        />
      </div>
      <TimePeriodButtons />
      {props.graphSelect && <GraphSelectButtons />}
    </div>
  )
}
