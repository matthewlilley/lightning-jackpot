import { Alert, Button, Col, Form, Input, Modal, Row, Typography } from 'antd'
import {
  CloseOutlined,
  GatewayOutlined,
  SyncOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { Field, formValueSelector, reduxForm } from 'redux-form/immutable'
import React, { Component } from 'react'
import { clearTransaction, deposit } from '../containers/app/actions'
import { connectModal, show as showModal } from 'redux-modal'
import { numericality, required } from 'redux-form-validators'
import { selectTransaction, selectWebLN } from '../containers/app/selectors'

import { Dots } from '../components'
import { NumberField } from '../forms'
import QRCode from 'qrcode.react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

class DepositModal extends Component<any> {
  static defaultProps = {
    loading: false,
  }
  state = {
    loading: this.props.loading,
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.webln.isEnabled &&
      !prevProps.transaction &&
      this.props.transaction
    ) {
      this.props.handleHide()
      this.props.webln.sendPayment(this.props.transaction.paymentRequest)
    }
  }
  componentWillUnmount() {
    this.setState({ loading: false })
  }
  submit = async values => {
    const { value } = values
    this.setState({ loading: true })
    this.props.dispatch(deposit(values.get('value')))
  }
  cancel = () => {
    this.props.dispatch(clearTransaction())
    this.props.handleHide()
  }
  render() {
    const { show, handleSubmit, pristine, submitting } = this.props
    const invoice =
      this.props.transaction &&
      this.props.transaction.paymentRequest &&
      !this.props.transaction.paid
    return (
      <Modal
        title="Deposit"
        centered={true}
        visible={show}
        onCancel={this.cancel}
        confirmLoading={this.state.loading}
        width={304}
        footer={null}
      >
        <Alert
          message={
            <>
              <a
                href="https://webln.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                WebLN
              </a>
              : {this.props.webln.isEnabled ? 'Detected 👍' : 'Not detected 👎'}
            </>
          }
          type={this.props.webln.isEnabled ? 'success' : 'info'}
        />
        {!invoice ? (
          <Form
            onFinish={handleSubmit(this.submit)}
            noValidate={true}
            size="large"
            layout="vertical"
            style={{ marginTop: 8 }}
          >
            <Field
              label="Satoshi"
              name="value"
              type="number"
              placeholder="1337"
              size="large"
              min={1000}
              step={1000}
              component={NumberField}
              style={{ width: '100%' }}
              validate={[required(), numericality({ int: true, '>=': 1000 })]}
            />

            <Button
              key="submit"
              size="large"
              type="primary"
              htmlType="submit"
              loading={this.state.loading}
              icon={<SyncOutlined />}
              disabled={pristine || submitting}
              block={true}
            >
              Generate Invoice
            </Button>
          </Form>
        ) : (
          <>
            <QRCode
              value={this.props.transaction.paymentRequest}
              size={256}
              renderAs="svg"
              style={{ margin: '24px 0' }}
            />
            <Typography.Paragraph
              copyable={true}
              ellipsis={true}
              style={{ marginBottom: 24 }}
            >
              {this.props.transaction.paymentRequest}
            </Typography.Paragraph>

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={24}>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  icon={<ThunderboltOutlined />}
                  block={true}
                  href={`lightning::${this.props.transaction.paymentRequest}`}
                >
                  Pay Invoice
                </Button>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Button
                  key="cancel"
                  size="large"
                  type="danger"
                  icon={<CloseOutlined />}
                  onClick={this.cancel}
                  block={true}
                >
                  CANCEL
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  key="back"
                  size="large"
                  onClick={this.props.showModal('node-info')}
                  icon={<GatewayOutlined />}
                  block={true}
                >
                  Node
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Modal>
    )
  }
}

const selector = formValueSelector('deposit')

const mapStateToProps = createStructuredSelector({
  transaction: selectTransaction(),
  value: state => selector(state, 'value'),
  webln: selectWebLN(),
})

const mapDispatchToProps = dispatch => ({
  showModal: name => () => dispatch(showModal(name)),
})

export default reduxForm({
  form: 'deposit',
  // validate: ({ value }) => {
  //   const errors = {
  //     value: ""
  //   };

  //   if (!value) {
  //     errors.value = "Required";
  //   }

  //   if (value < 1000) {
  //     errors.value = "Value must be at least 1000 Satoshi";
  //   }

  //   return errors;
  // }
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    connectModal({
      name: 'deposit',
      destroyOnHide: true,
      getModalState: state => state.get('modal'),
    })(DepositModal)
  )
)
