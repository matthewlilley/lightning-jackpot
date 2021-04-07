import { Modal, Typography } from 'antd'
import React, { Component } from 'react'

import QRCode from 'qrcode.react'
import { connectModal } from 'redux-modal'
import getConfig from 'next/config'

const {
  publicRuntimeConfig: { LND_PUBLIC_KEY, LND_HOST, LND_P2P_PORT },
} = getConfig()

function NodeInfo(props) {
  const { show, handleHide } = props
  const address = `${LND_PUBLIC_KEY}@${LND_HOST}:${LND_P2P_PORT}`
  return (
    <Modal
      title="Node"
      centered={true}
      visible={show}
      footer={null}
      onCancel={handleHide}
      width={304}
    >
      <QRCode value={address} size={256} renderAs="svg" />
      <Typography.Paragraph
        copyable={true}
        ellipsis={true}
        style={{ margin: 0, marginTop: 16 }}
      >
        {address}
      </Typography.Paragraph>
    </Modal>
  )
}
export default connectModal({
  name: 'node-info',
  destroyOnHide: true,
  getModalState: state => state.get('modal'),
})(NodeInfo)
