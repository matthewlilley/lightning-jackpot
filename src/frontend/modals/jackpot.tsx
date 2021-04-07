import { Modal, Typography } from 'antd'

import { connectModal } from 'redux-modal'

function Jackpot(props) {
  const { show, handleHide } = props
  return (
    <Modal
      title="Jackpot"
      centered={true}
      visible={show}
      footer={null}
      onCancel={handleHide}
    >
      <Typography.Paragraph>
        0.04% of total bets will go into a jackpot. In each round, there is a
        small chance (that round's total bet value in dollars / 1000000) of the
        roulette wheel landing on a special "Lightning" icon. When that happens,
        the jackpot will be split proportionally between all eligible players in
        that round.
      </Typography.Paragraph>
      <Typography.Paragraph>
        The amount you earn from the jackpot depends on your bet amount that
        round. For example, if the jackpot hits and the total bet value that
        round is 500 Satoshi and your bet value that round is 250 Satoshi, you
        will earn 50% of the jackpot.
      </Typography.Paragraph>
    </Modal>
  )
}
export default connectModal({
  name: 'jackpot',
  destroyOnHide: true,
  getModalState: state => state.get('modal'),
})(Jackpot)
