import { WinningType, multiplier } from '@lightning-jackpot/common'

import BearImage from '../images/bear.svg?sprite'
import BullImage from '../images/bull.svg?sprite'
import LightningImage from '../images/lightning.svg?sprite'
import MoonImage from '../images/rocket.svg?sprite'

const { Bear, Moon, Bull, Lightning } = WinningType

export const betTypes = {
  Bear: {
    color: '#f5222d',
    image: BearImage,
    multiplier: multiplier(Bear),
    name: Bear,
  },
  Moon: {
    color: '#001529',
    image: MoonImage,
    multiplier: multiplier(Moon),
    name: Moon,
  },
  Bull: {
    color: '#52c41a',
    image: BullImage,
    multiplier: multiplier(Bull),
    name: Bull,
  },
}

export const winningTypes = {
  ...betTypes,
  Lightning: {
    color: '#722ed1',
    image: LightningImage,
    name: Lightning,
  },
}
