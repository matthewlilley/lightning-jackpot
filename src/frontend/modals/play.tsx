import { BetForm } from '../forms'
import { Modal } from 'antd'
import { connectModal } from 'redux-modal'

export const PlayModal = connectModal({
  name: 'play',
  destroyOnHide: false,
  getModalState: state => state.get('modal'),
})(({ show, handleHide }) => {
  return (
    <Modal
      centered={true}
      className="play-modal"
      footer={null}
      onCancel={handleHide}
      onOk={handleHide}
      style={{ bottom: 0 }}
      title="Play"
      visible={show}
    >
      <BetForm />
    </Modal>
  )
})
