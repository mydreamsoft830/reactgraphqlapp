

const Needle = ({width, size, transformStr, round, value = null}) => {
       
    const height = size/500*20
    const transformStr1 = (width/2).toString() + ' ' + ((width-height)/2).toString();
    
    const d = (100-round)/100*360

    const zeroR = (180+d)/2

    const percentR = zeroR + 360 * (value ? value.p : 0) / 100 * round / 100

    return (
        <g transform={'translate(' + transformStr1 + ')'}
            fill="#000000" stroke="none">
            <g transform={'rotate(' + percentR + ') translate(0 -'+ height/2 +')'}>
                <svg height={size/500*20} width={size} viewBox="0 0 500 20" style={{
                    background: 'transparent',
                }}>
                    <path d="M0 3 L490 3 L490 0 L500 10 L490 20 L490 17 L0 17 Z" />
                </svg>
            </g>
        </g>
    )

}

export default Needle
