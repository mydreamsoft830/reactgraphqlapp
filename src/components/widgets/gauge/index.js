
import { useEffect, useState, useRef } from 'react'
import Pie from 'paths-js/pie'
import Needle from './Needle'
import classNames from 'classnames'

import './gauge.scss'

const defaultWidth = 450
const round = 50
const addRound = (- 180 + 360 * (100 - round) / 100 / 2)

const GaugeWidget = (props) => {
	
    const { data, widgetInfo } = props

    const [gaugeValues, setGaugeValues] = useState([])
	const [width, setWidth] = useState(defaultWidth)
	
	const widgetRef = useRef()

    const stokeWidth = 30
    const stokeProgressWidth = stokeWidth/2
	
	useEffect(() => {
		setGaugeValues(progressList(makeValue(data)))
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [width, data])
	
	useEffect(() => {
		let componentSize = widgetRef?.current?.clientWidth
		if(!componentSize) componentSize = defaultWidth
		if(widgetRef?.current?.clientHeight && widgetRef?.current?.clientHeight < componentSize) componentSize = widgetRef?.current?.clientHeight
		setWidth(componentSize)
	}, [widgetRef?.current?.clientWidth, widgetRef?.current?.clientHeight])
	
	const getTransform = (flag = false) => {
		return  (flag ? '-' : '') + (width/2).toString() + (flag ? ' -' : ' ') + (width/2).toString()
	}

	const getRM = () => {
		const rD = (width / 2) * 0.8
		return rD - stokeWidth / 2
	}

    const backgroundPie = () => {
		const rM = getRM()
        return Pie({
            r: rM,
            R: rM,
            center: [width/2, width/2],
            data: [round, 100 - round],
            accessor(x) {
                return x
            }
        })
    }

	const generateColor = () =>
        'rgb(' + (256 - Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (256 - Math.floor(Math.random() * 256)) + ')'

	const progressList = (percents) => {
		const _array = []
		const rD = (width / 2) * 0.8
		
		const r = rD - stokeProgressWidth / 2 - (stokeWidth - stokeProgressWidth) / 2
		
		let sum  = 0

		for(let i=0; i<percents.length; i++) {
			let _percent = percents[i].percent
			const _arrayValue = {
				i: i,
				l: percents[i].title,
				p: _percent,
				p2: percents[i].percent,
				c: generateColor(),
				t: addRound + 360 * round / 100 * sum / 100,
				s: sum,
				value: percents[i].value,
				pie: Pie({
					r,
					R: r,
					center: [width/2, width/2],
					data: [_percent * round / 100, 100 - round + (100 - _percent) * round / 100],
					accessor(x) {
						return x
					}
				})
			}
			_array.push(_arrayValue)
			sum += _percent
		}
		return _array
	}
	
    const makeValue = (data) => {
        const temp = []
        if(data && data.length > 0){
            const keys = Object.keys(data[0]).filter(key => key !== 'timestamp')
            if(keys.length > 0){
				const mainKey = keys[0]
				let sumByKey = 0
				data.forEach((item) => {
					sumByKey += Number(item[mainKey])
				})
				data.forEach((item, index) => {
					const _item = {
						id: index,
						title: mainKey + index.toString(),
						value: item[mainKey],
						percent: Number(item[mainKey]) / Number(sumByKey) * 100,
					}
					temp.push(_item)
				})
            }
        }
        return temp
    }
    

    return (
		<div className={'gauge-layout'} id={'gauge-layout' + widgetInfo.id} ref={widgetRef}>
			<svg
				version='1.1'
				xmlns='http://www.w3.org/2000/svg'
				width={width}
				height={width}
			>
				<Needle value={gaugeValues.length > 0 ? gaugeValues[0] : null } width={width} size={(getRM()-15) * 0.9} transformStr={getTransform()} round={round}/>
				<g
					transform={'translate(' + getTransform() + ')'}
					>
					<path
						d={backgroundPie().curves[0].sector.path.print()}
						strokeWidth={stokeWidth}
						stroke={
							'#F0F0F0'
						}
						transform={'rotate(' + addRound + ') translate(' + getTransform(true) + ')'}
					/>
				</g>
				<g
					transform={'translate(' + getTransform() + ')'}
					>
					{
						gaugeValues.map((_p, i) => {
							return <path
								key={i.toString()}
								d={_p.pie.curves[0].sector.path.print()}
								strokeWidth={stokeProgressWidth}
								stroke={
									_p.c
								}
								transform={'rotate('+ _p.t +') translate(' + getTransform(true) + ')'}
							/>
						})
					}
				</g>
			</svg>
			<div 
				className={classNames({
					'center-title': true,
					'item-center': true,
				})} 
				style={{
					width: width,
					height: width,
				}}
			>
				<span>{gaugeValues.length > 0 ? Number(gaugeValues[0].value).toFixed(2) : ''}</span>
			</div>
		</div>
	)

}

export default GaugeWidget

