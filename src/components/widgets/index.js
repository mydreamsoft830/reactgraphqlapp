import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GetTimeseriesMultiQueryData } from 'graphql/queries'
import { useStateContext } from 'context/state';
import { useRemoveDashboardWidget } from 'hooks/widget';

import { BiDotsVerticalRounded, BiEdit, BiTrash } from 'react-icons/bi';
import { LoadingSmall } from 'components/loading';
import Dropdown, { DropdownItem } from 'components/dropdown';
import Error from 'components/error';
import { timeValueToMs, roundTo5mins } from 'util/timeseries';
import GraphWidget from './graph';
import ValueWidget from './value';
import GaugeWidget from './gauge';

import './widget.scss'

const WidgetItem = (props) => {
    const { widgetInfo, timePeriod, timeOffset, editWidget } = props
    const { selectedProject } = useStateContext()
    const removeWidget = useRemoveDashboardWidget(widgetInfo)
    const containerRef = useRef(null)
    const containerSize = containerRef.current
        ? Math.min(
            containerRef.current.clientHeight,
            containerRef.current.clientWidth / 3
        )
        : 30
    const fontSize = containerSize / 1.5

    const [multiQueryVariables, setMultiQueryVariables] = useState({
        projectId: selectedProject.id,
        queries: widgetInfo?.configuration?.query || [],
        startTime: Date.now(),
        endTime: Date.now(),
        rollupInterval: 0
    })

    const calcQueryVariablesTimes = useCallback((timePeriod, timeOffset) => {
        const timeDelta = timeValueToMs(timePeriod)

        return {
            startTime: roundTo5mins(Date.now() - timeDelta + timeOffset, 'down'),
            endTime: roundTo5mins(Date.now() + timeOffset, 'up')
        }
    }, [])

    useEffect(() => {
        setMultiQueryVariables(vars => {
            return Object.assign(
                {},
                vars,
                calcQueryVariablesTimes(timePeriod, timeOffset)
            )
        })
    }, [calcQueryVariablesTimes, timePeriod, timeOffset])

    const {
        data: multiQueryDataResults,
        loading,
        error
    } = useQuery(GetTimeseriesMultiQueryData, {
        variables: multiQueryVariables,
        // skip: multiQueryVariables.queries.length === 0,
        notifyOnNetworkStatusChange: true
    })

    const multiQueryData =
        multiQueryDataResults && multiQueryDataResults.timeseriesMultiQuery
            ? multiQueryDataResults.timeseriesMultiQuery
            : null

    const { data, queryFields } = useMemo(() => {
        const rows = []
        const fields = []
        if (!multiQueryData) return rows
        multiQueryData.forEach(series => {
            series.results.forEach(item => {
                const rowTempate = {}
                item.fields.forEach(field => {
                    fields.push(field)
                })
                if (item.groupTags[0] !== '*') {
                    item.groupTags.forEach(tagStr => {
                        const [name, value] = tagStr.split('=')
                        rowTempate[name] = value
                    })
                }

                item.timestamps.forEach((timestamp, i) => {
                    const row = Object.assign({ timestamp }, rowTempate)

                    item.fields.forEach(field => {
                        row[field.name] = field.values[i]
                    })

                    rows.push(row)
                })
            })
        })
        return {
            data: rows.sort((a, b) => a.timestamp - b.timestamp),
            queryFields: fields
        }
    }, [multiQueryData])
    // Refresh every 10 sec
    useEffect(() => {
        const interval = setInterval(() => {
            setMultiQueryVariables(vars => {
                return Object.assign(
                    {},
                    vars,
                    calcQueryVariablesTimes(timePeriod, timeOffset)
                )
            })
        }, 10 * 1000)

        return () => {
            clearInterval(interval)
        }
    }, [calcQueryVariablesTimes, timePeriod, timeOffset])

    const handleEditWidget = useCallback(() => {
        editWidget(widgetInfo, setMultiQueryVariables, multiQueryVariables)
    }, [editWidget, widgetInfo, setMultiQueryVariables, multiQueryVariables])
    return (
        <>
            <div className='widget'>
                <div className='widget-header'>
                    <h3 className='title'>{widgetInfo?.displayName}</h3>
                    <Dropdown icon={<BiDotsVerticalRounded />} size='20px'>
                        <DropdownItem
                            name="Edit"
                            icon={<BiEdit />}
                            onClick={handleEditWidget}
                        />

                        <DropdownItem
                            name="Delete"
                            icon={<BiTrash />}
                            className="red"
                            onClick={removeWidget}
                        />
                    </Dropdown>
                </div>
                <div className='widget-content-body' ref={containerRef}>
                    {
                        loading ? (
                            <LoadingSmall />
                        ) : error ? (
                            <Error error={error} />
                        ) : widgetInfo.type === 'GRAPH' ? (
                            <GraphWidget {...props} data={data} queryFields={queryFields} />
                        ) : widgetInfo.type === 'VALUE' ? (
                            <ValueWidget {...props} data={data} queryFields={queryFields} fontSize={fontSize} />
                        ) : widgetInfo.type === 'GAUGE' ? (
                            <GaugeWidget {...props} data={data} queryFields={queryFields} fontSize={fontSize} />
                        ) : ''
                    }
                </div>
            </div>

        </>
    )
}

export default WidgetItem
