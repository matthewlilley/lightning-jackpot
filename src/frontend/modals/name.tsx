import { Button, Form, Input, Modal } from 'antd'
import { Field, formValueSelector, reduxForm } from 'redux-form/immutable'
import { connectModal, hide } from 'redux-modal'
import { length, required } from 'redux-form-validators'

import { InputField } from '../forms'
import React from 'react'
import { SaveOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import { selectUsername } from '../containers/app/selectors'
import { setName } from '../containers/app/actions'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

const validate = values => {
  // console.log('validate', values)
  const errors: any = {}
  if (!values.has('name')) {
    errors.name = 'Required'
  }
  return errors
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const asyncValidate = (values /*, dispatch */) => {
  return fetch(`${APP_URL}/api/v0/names/${values.get('name')}`).then(res => {
    if (res.status === 200) {
      return res.json().then(json => {
        throw json
      })
    }
  })
}

const selector = formValueSelector('name')

const initialValues = createStructuredSelector({
  name: selectUsername(),
})

const mapStateToProps = createStructuredSelector({
  name: state => selector(state, 'name'),
  initialValues,
})

const mapDispatchToProps = dispatch => ({
  name: name => dispatch(setName(name)),
  hide: () => dispatch(hide('name')),
})

const NameForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'name',
    enableReinitialize: true,
    validate,
    asyncValidate,
    asyncBlurFields: ['name'],
  })(({ name, hide, handleSubmit, pristine, submitting }) => {
    function submit(values) {
      name(values.get('name'))
      hide()
    }
    return (
      <Form onFinish={handleSubmit(submit)}>
        <Field
          name="name"
          component={InputField}
          placeholder="Satoshi Nakamoto"
          hasFeedback={true}
          size="large"
          validate={[required(), length({ min: 1, max: 20 })]}
        />
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          block={true}
          disabled={pristine || submitting}
        >
          Save
        </Button>
      </Form>
    )
  })
)

export const NameModal = connectModal({
  name: 'name',
  destroyOnHide: true,
  getModalState: state => state.get('modal'),
})(props => {
  const { show, handleHide } = props
  return (
    <Modal
      title="Name"
      centered={true}
      visible={show}
      onCancel={handleHide}
      width={300}
      footer={null}
    >
      <NameForm />
    </Modal>
  )
})
