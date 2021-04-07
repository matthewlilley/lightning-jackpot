import AvatarModal from './avatar'
import { BetModal } from './bet'
import ColorModal from './color'
import DepositModal from './deposit'
import JackpotModal from './jackpot'
import LoginModal from './login'
import { NameModal } from './name'
import NodeInfoModal from './node-info'
import { PlayModal } from './play'
import TipModal from './tip'
// import { WelcomeModal } from "./welcome";
import WithdrawModal from './withdraw'

export default () => (
  <>
    <AvatarModal />
    <BetModal />
    <ColorModal />
    <DepositModal />
    <LoginModal />
    <NameModal />
    <NodeInfoModal />
    <PlayModal />
    <TipModal />
    <WithdrawModal />
    <JackpotModal />
    {/* <WelcomeModal /> */}
  </>
)
