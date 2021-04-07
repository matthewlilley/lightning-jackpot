import { Button, Form, Modal, Typography } from 'antd'
import { Field, formValueSelector, reduxForm } from 'redux-form/immutable'
import React, { Component } from 'react'

import { InputField } from '../forms'
import { connect } from 'react-redux'
import { connectModal } from 'redux-modal'

const WelcomeForm = reduxForm({
  form: 'welcome',
  enableReinitialize: true,
})(({ handleSubmit }) => {
  return (
    <Form onFinish={handleSubmit}>
      <Field
        name="uuid"
        component={InputField}
        size="large"
        readonly={true}
        disabled={true}
        placeholder="3bab3dce-1383-4e9c-a9a9-e1d55c882367"
        style={{ margin: 0, textAlign: 'center' }}
      />
    </Form>
  )
})

export const WelcomeModal = connectModal({
  name: 'welcome',
  destroyOnHide: true,
  getModalState: state => state.get('modal'),
})(({ show, handleHide }) => {
  function submit(values) {
    //
    handleHide()
  }
  return (
    <Modal
      title="Welcome"
      closable={false}
      centered={true}
      onCancel={handleHide}
      cancelText={`I understand, I've written down my seed.`}
      okText={`Create account`}
      visible={show}
    >
      <Typography.Paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </Typography.Paragraph>
      <WelcomeForm handleSubmit={submit} />
      <Typography.Paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </Typography.Paragraph>
    </Modal>
  )
})
