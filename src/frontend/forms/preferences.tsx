import { Button, Form } from 'antd'
import { Field, reduxForm } from 'redux-form/immutable'
import { email, required } from 'redux-form-validators'
import { SaveOutlined } from '@ant-design/icons'
import { InputField } from '.'
import Router from 'next/router'
import { connect } from 'react-redux'
import getConfig from 'next/config'
import { useState } from 'react'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

export const PreferencesForm = connect(
  null,
  null
)(
  reduxForm({
    form: 'preferences',
    enableReinitialize: true,
  })(({ handleSubmit, pristine, submitting }) => {
    const [loading, setLoading] = useState(false)
    async function submit(values) {
      setLoading(true)
      const response = await fetch(`${APP_URL}/api/v0/preferences`, {
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
        style={{ minWidth: 240, maxWidth: 240, margin: '24px auto' }}
        size="large"
      >
        <Field
          label="Display Name"
          name="name"
          component={InputField}
          placeholder="Satoshi Nakamoto"
          hasFeedback={true}
          size="large"
          validate={[required()]}
        />
        <Field
          label="Tip Verb"
          name="tipVerb"
          component={InputField}
          placeholder="Launched"
          hasFeedback={true}
          size="large"
          validate={[]}
        />
        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            block={true}
            loading={loading}
            disabled={pristine || submitting}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    )
  })
)
