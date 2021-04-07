import './index.css'

import React, {
  Ref,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { animated, config, useSpring } from 'react-spring'

import classNames from 'classnames'
import useComponentSize from '@rehooks/component-size'

export interface PocketProps {
  id: number
  name: string
  image: string | JSX.Element
  color: string
  xs?: string | number
  sm?: string | number
  md?: string | number
  lg?: string | number
  xl?: string | number
  xxl?: string | number
  style?: object
}
// interface PocketState {}

export function Pocket(props: PocketProps) {
  const { id, name, image, color, style, ...rest } = props
  return (
    <li className="pocket" style={style}>
      {image}
    </li>
  )
}

Pocket.defaultProps = {
  xs: '50px', // < 576px
  sm: '60px', // >= 576px
  md: '70px', // >= 768px
  lg: '80px', // >= 992px
  xl: '90px', // >= 1200px
  xxl: '100px', // >= 1600px
}

// console.log("pockets", pockets);

// interface PocketsProps {
//   pockets: PocketProps[]
// }

// function Pockets(props: PocketsProps) {
//   return ()
// }

export interface WheelProps {
  delay?: number
  direction?: 'backwards' | 'forwards'
  layout?: 'horizontal' | 'vertical'
  onSpin?: Function
  onSpun?: Function
  overlay?: string | JSX.Element
  pockets: PocketProps[]
  renderPocket?: Function
  repeat?: number
  resetDuration?: number
  spinning?: boolean
  spinDuration?: number
  spun?: boolean
  start?: number
  winner: number
  noLine?: boolean
  springProps?: object
}

export interface WheelState {
  spinning: boolean
  spun: boolean
  pockets: PocketProps[]
}

const easing = t => {
  return --t * t * t + 1
}

export const Wheel = memo<WheelProps>(
  ({
    delay = 0,
    direction = 'backwards',
    layout = 'horizontal',
    onSpin,
    onSpun,
    overlay,
    pockets = [],
    // renderPocket,
    repeat = 10,
    resetDuration = 1000,
    spinDuration = 5000,
    start = 0,
    winner = NaN,
    noLine = true,
    springProps,
    ...rest
  }) => {
    // const [height, setHeight] = useState(0);

    // const [width, setWidth] = useState(0);

    // const ref = useCallback(node => {
    //   if (node !== null) {
    //     const boundingClientRect = node.getBoundingClientRect();
    //     setHeight(boundingClientRect.height);
    //     setWidth(boundingClientRect.width);
    //   }
    // }, []);

    const ref = useRef(null)
    const size = useComponentSize(ref)
    const { width, height } = size

    const border = 0

    const pocketSize = (layout === 'horizontal' ? height : width) - border

    const [generatedPockets, setPockets] = useState(
      Array.from(Array(repeat + 2)).reduce(
        (previousValue, currentValue) => [...previousValue, ...pockets],
        []
      )
    )

    const [spinning, setSpinning] = useState(false)

    const [spun, setSpun] = useState(false)

    useEffect(() => {
      if (Number.isInteger(winner) && !spinning) {
        setSpinning(true)
      }
      if (!Number.isInteger(winner)) {
        setSpinning(false)
      }
    }, [spinning, winner])

    const s = start > 0 ? start + 1 : start

    const w = Number.isInteger(winner)
      ? start > 0
        ? winner - start
        : winner + 1
      : 0

    const wheel = generatedPockets.length * pocketSize

    const halfWheel = wheel / 2

    const halfPocket = pocketSize / 2

    const area = halfWheel - pockets.length * pocketSize * 2

    const margin = 0

    const random = Math.random() > 0.5

    const min = random ? 0 : -pocketSize * 0.5 + margin
    const max = random ? pocketSize * 0.5 - margin : 0

    const lessPredictable = Math.floor(Math.random() * (max - min)) + min

    const t = (s + w) * pocketSize + area - halfPocket - lessPredictable

    const f = s > 0 ? s * pocketSize - halfPocket : halfPocket

    const ft = direction === 'forwards' ? f : -f

    const tt = direction === 'forwards' ? t : -t

    const from = {
      transform: `matrix(1, 0, 0, 1, ${layout === 'horizontal' ? ft : 0}, ${
        layout === 'vertical' ? ft : 0
      }`,
    }

    const to = {
      transform: `matrix(1, 0, 0, 1, ${layout === 'horizontal' ? tt : 0}, ${
        layout === 'vertical' ? tt : 0
      })`,
    }

    const config = {
      duration: Number.isInteger(winner) ? spinDuration : resetDuration,
      easing,
    }

    const style = useSpring({
      config,
      delay,
      from,
      reverse: !Number.isInteger(winner),
      onStart: () => {
        if (Number.isInteger(winner) && !spinning && onSpin) {
          onSpin()
        }
      },
      onRest: () => {
        if (Number.isInteger(winner) && onSpun) {
          onSpun()
        }
      },
      to: Number.isInteger(winner) ? to : undefined,
      // reset: Number.isInteger(winner),
      ...springProps,
    })

    // console.log({
    //   repeat,
    //   layout,
    //   direction,
    //   // spinning,
    //   start,
    //   winner,
    //   width,
    //   height,
    //   s,
    //   w,
    //   wheel,
    //   halfWheel,
    //   halfPocket,
    //   area,
    //   lessPredictable,
    //   t,
    //   f,
    //   ft,
    //   tt,
    //   ...rest,
    // })

    return (
      <div
        className={classNames('wheel', {
          'wheel--vertical': layout === 'vertical',
          'wheel--no-line': noLine,
          'wheel--spinning': spinning,
        })}
        {...rest}
      >
        <div className="wheel-overlay">
          {overlay && <div style={{ textAlign: 'center' }}>{overlay}</div>}
        </div>

        <animated.ul className="pockets" ref={ref} style={style}>
          {generatedPockets.map((pocket: PocketProps, index: number) => (
            <Pocket
              key={index}
              {...pocket}
              style={{
                borderTop:
                  layout === 'horizontal' ? `2px solid ${pocket.color}` : 0,
                borderRight:
                  layout === 'vertical' ? `2px solid ${pocket.color}` : 0,
                borderBottom:
                  layout === 'horizontal' ? `2px solid ${pocket.color}` : 0,
                borderLeft:
                  layout === 'vertical' ? `2px solid ${pocket.color}` : 0,
              }}
            />
          ))}
        </animated.ul>
      </div>
    )
  },
  (prevProps, nextProps) => {
    // console.log({ prevProps, nextProps });
    if (Number.isInteger(nextProps.winner)) {
      return prevProps.winner === nextProps.winner
    }
    return (
      prevProps.winner === nextProps.winner &&
      prevProps.overlay === nextProps.overlay
    )
  }
)
