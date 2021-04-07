import { Button, Form, Modal, Typography } from 'antd'
import { Field, formValueSelector, reduxForm } from 'redux-form/immutable'
import { InputField, NumberField } from '../forms'
import React, { Component } from 'react'
import { connectModal, show } from 'redux-modal'
import { numericality, required } from 'redux-form-validators'
import { selectBalance, selectTipRecipient } from '../containers/app/selectors'

import { RocketOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { tip } from '../containers/app/actions'

class Tip extends Component<any> {
  static defaultProps = {
    loading: false,
    user: null,
  }
  state = {
    loading: this.props.loading,
    user: this.props.user,
  }
  componentDidMount() {
    this.props.initialize({
      recipient: this.props.recipient,
      value: this.props.value,
    })
  }
  componentWillUnmount() {
    this.setState({ loading: false })
  }
  submit = async values => {
    this.setState({ loading: true })
    this.props.tip({
      value: values.get('value'),
      recipient: { name: values.get('recipient') },
    })
    setTimeout(() => {
      this.setState({ loading: false })
    }, 1000)
  }
  render() {
    const {
      balance,
      show,
      handleHide,
      handleSubmit,
      value,
      pristine,
      submitting,
    } = this.props
    return (
      <Modal
        title="Tip"
        centered={true}
        visible={show}
        onOk={handleSubmit(this.submit)}
        onCancel={handleHide}
        width={304}
        footer={null}
      >
        <Form
          onFinish={handleSubmit(this.submit)}
          size="large"
          layout="vertical"
        >
          <Form.Item label="Recipient">
            <Field
              component={InputField}
              name="recipient"
              placeholder="@Satoshi"
              size="large"
              type="text"
              validate={[required()]}
              noStyle
            />
          </Form.Item>

          <Form.Item label="Satoshi">
            <Field
              component={NumberField}
              min={1000}
              name="value"
              placeholder="10000"
              size="large"
              // step={1000}
              style={{ width: '100%' }}
              type="number"
              validate={[
                required(),
                numericality({ int: true, '>=': 1000, '<=': balance }),
              ]}
              noStyle
            />
          </Form.Item>

          <Form.Item label="Fee">
            <span className="ant-form-text">
              {this.props.value ? Math.floor(this.props.value * 0.025) : 0}
            </span>
          </Form.Item>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            loading={this.state.loading}
            icon={<RocketOutlined />}
            block={true}
            disabled={pristine || submitting}
          >
            Send
          </Button>
        </Form>
      </Modal>
    )
  }
}

const selector = formValueSelector('tip')

const mapStateToProps = createStructuredSelector({
  value: state => selector(state, 'value'),
  recipient: selectTipRecipient(),
  balance: selectBalance(),
})

const mapDispatchToProps = dispatch => ({
  tip: t => dispatch(tip(t)),
  show: name => () => dispatch(show(name)),
})

export default reduxForm({
  form: 'tip',
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    connectModal({
      name: 'tip',
      destroyOnHide: true,
      getModalState: state => state.get('modal'),
    })(Tip)
  )
)
