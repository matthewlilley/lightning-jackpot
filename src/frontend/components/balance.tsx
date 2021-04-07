import { animated, useSpring } from 'react-spring'
import { useEffect, useState } from 'react'

import { Button } from 'antd'

export function Balance({ balance }) {
  const [type, setType] = useState('SAT')
  function toggle() {
    setType(type === 'SAT' ? '$' : 'SAT')
  }
  const [exchangeRate, setExchangeRate] = useState(0)
  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        const response = await fetch(
          'https://blockchain.info/tobtc?currency=USD&value=1'
        )
        setExchangeRate((await response.json()) * 100000000)
      } catch (e) {
        console.error(e)
      }
    }
    fetchExchangeRate()
  }, [exchangeRate])
  const props = useSpring({
    balance: type === 'SAT' ? balance : balance / exchangeRate,
    from: { balance: 0 },
  })
  // console.log("exchange rate is ", exchangeRate);
  return (
    <Button type="dashed" onClick={toggle}>
      {type === '$' && type}
      <animated.span>
        {props.balance.to(balance => Math.floor(balance).toLocaleString())}
      </animated.span>
      {type === 'SAT' && <span style={{ marginLeft: '4px' }}>{type}</span>}
    </Button>
  )
}
