import { Button, Form, Input, Modal, Typography } from 'antd'
import { Field, reduxForm } from 'redux-form/immutable'
import React, { Component } from 'react'

import { Exclamation } from 'styled-icons/fa-solid'
import { InputField } from '../forms'
import Router from 'next/router'
import { connect } from 'react-redux'
import { connectModal } from 'redux-modal'
import getConfig from 'next/config'

const { Paragraph } = Typography

const { publicRuntimeConfig } = getConfig()
const { APP_URL, APP_PORT } = publicRuntimeConfig

const validate = values => {
  const errors: any = {}
  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  return errors
}

class Login extends Component<any> {
  static defaultProps = {
    message: null,
  }

  state = {
    message: this.props.message,
    loading: false,
  }

  setMessage = message => {
    this.setState({ message })
  }

  submit = async values => {
    this.setState({ loading: true })
    const response = await fetch(`${APP_URL}/api/v0/auth`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.status === 200) {
      this.setState({ loading: false })
      this.props.handleHide()
      Router.replace({
        pathname: '/verify',
      })
    }
  }

  render() {
    const {
      show,
      error,
      handleHide,
      handleSubmit,
      pristine,
      submitting,
    } = this.props
    return (
      <Modal
        title="Login"
        centered={true}
        visible={show}
        onOk={handleSubmit(this.submit)}
        okText="Login"
        onCancel={handleHide}
        confirmLoading={this.state.loading}
        footer={null}
        width={470}
      >
        <Paragraph>
          Enter your email and click login, we’ll send you a confirmation email.
        </Paragraph>

        <Form onFinish={handleSubmit(this.submit)}>
          <Field
            name="email"
            label="Email"
            type="email"
            size="large"
            placeholder="satoshi@protonmail.com"
            component={InputField}
            colon={true}
            required={true}
          />
          <Button
            htmlType="submit"
            type="primary"
            block={true}
            size="large"
            style={{ textAlign: 'center' }}
            loading={this.state.loading}
          >
            Login
          </Button>
        </Form>

        {/* <Paragraph style={{ margin: 0, textAlign: 'center' }}>
          By logining into Lightning Jackpot, you agree to our{' '}
          <Link href='terms-of-service'>
            <a color='black' style={{ padding: 0 }} onClick={handleHide}>
              Terms of Service
            </a>
          </Link>{' '}
          and{' '}
          <Link href='privacy-policy'>
            <a color='black' style={{ padding: 0 }} onClick={handleHide}>
              Privacy Policy
            </a>
          </Link>
          .
        </Paragraph> */}
      </Modal>
    )
  }
}

export default reduxForm({
  form: 'login',
  validate,
})(
  connect()(
    connectModal({
      name: 'login',
      destroyOnHide: true,
      getModalState: state => state.get('modal'),
    })(Login)
  )
)
