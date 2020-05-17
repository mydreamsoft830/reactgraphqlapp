export const timeOptions = [
    { value: '1h', label: 'Last hour', rollupInterval: 0 },
    { value: '3h', label: 'Last 3 hours', rollupInterval: 5 * 60 * 1000 },
    { value: '6h', label: 'Last 6 hours', rollupInterval: 15 * 60 * 1000 },
    { value: '12h', label: 'Last 12 hours', rollupInterval: 30 * 60 * 1000 },
    { value: '1d', label: 'Last day', rollupInterval: 60 * 60 * 1000 },
    { value: '1w', label: 'Last week', rollupInterval: 3 * 60 * 60 * 1000 },
    { value: '1M', label: 'Last month', rollupInterval: 12 * 60 * 60 * 1000 },
    { value: '3M', label: 'Last quarter', rollupInterval: 24 * 60 * 60 * 1000 }
]

export const timeValueToMs = timePeriod => {
    const amount = Number(timePeriod.value.slice(0, timePeriod.value.length - 1))
    const unit = timePeriod.value.slice(timePeriod.value.length - 1)

    let timeDelta = amount * 1000

    /* eslint-disable no-fallthrough */
    switch (unit) {
        case 'M':
            timeDelta = (timeDelta / 7) * 30
        case 'w':
            timeDelta *= 7
        case 'd':
            timeDelta *= 24
        case 'h':
            timeDelta *= 60
        case 'm':
            timeDelta *= 60
            break
        default:
            throw new Error('Unsupported time suffix')
    }
    /* eslint-enable no-fallthrough */

    return Math.round(timeDelta)
}

export const roundTo5mins = (timestamp, direction) => {
    const d = new Date(timestamp)
    const minutes = d.getMinutes()
    const remainder = minutes % 5

    if (direction === 'up') {
        d.setMinutes(minutes + (5 - remainder))
    } else {
        d.setMinutes(minutes - remainder)
    }

    d.setSeconds(0)
    d.setMilliseconds(0)
    return d.getTime()
}