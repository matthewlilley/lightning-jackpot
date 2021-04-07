import { Button, Form } from 'antd'
import { MailFilled } from '@ant-design/icons'
import { Field, reduxForm } from 'redux-form/immutable'
import { email, required } from 'redux-form-validators'

import { InputField } from '../forms'
import Router from 'next/router'
import { connect } from 'react-redux'
import getConfig from 'next/config'
import { useState } from 'react'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

export const LoginForm = connect(
  null,
  null
)(
  reduxForm({
    form: 'login',
    enableReinitialize: true,
  })(({ handleSubmit, pristine, submitting }) => {
    const [loading, setLoading] = useState(false)
    async function submit(values) {
      setLoading(true)
      const response = await fetch(`${APP_URL}/api/v0/auth`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {
        const { code } = await response.json()
        setLoading(false)
        Router.push({
          pathname: '/awaiting-confirmation',
          query: {
            code,
            email: values.get('email'),
          },
        })
      }
    }
    return (
      <Form
        onFinish={handleSubmit(submit)}
        style={{ minWidth: 240, maxWidth: 240, margin: '24px 0' }}
        size="large"
      >
        <Field
          name="email"
          component={InputField}
          placeholder="satoshi@protonmail.com"
          hasFeedback={true}
          size="large"
          prefix={<MailFilled style={{ color: 'rgba(0,0,0,.25)' }} />}
          validate={[required(), email()]}
        />
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          block={true}
          loading={loading}
          disabled={pristine || submitting}
        >
          Continue
        </Button>
      </Form>
    )
  })
)
