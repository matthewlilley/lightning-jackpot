import { Alert, Button, Col, Form, Modal, Row, Typography } from 'antd'
import { Field, formValueSelector, reduxForm } from 'redux-form/immutable'
import { InputField, NumberField } from '../forms'
import React, { useState } from 'react'
import { addValidator, numericality, required } from 'redux-form-validators'
import { connectModal, show } from 'redux-modal'
import { selectBalance, selectWebLN } from '../containers/app/selectors'

import { GatewayOutlined } from '@ant-design/icons'
import bolt11 from 'bolt11'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withdraw } from '../containers/app/actions'

const paymentRequestValidator: any = addValidator({
  validator: (options, value, allValues) => {
    try {
      bolt11.decode(value)
      return true
    } catch (error) {
      return {
        id: 'form.errors.custom',
        defaultMessage: error.message,
      }
    }
  },
})

function WithdrawModal(props) {
  const [loading, setLoading] = useState(false)

  const {
    balance,
    handleHide,
    handleSubmit,
    nodeInfo,
    paymentRequest,
    pristine,
    show,
    submitting,
    value,
    webln,
    withdraw,
  } = props

  const submit = values => {
    console.log({
      values,
    })
    if (webln.isEnabled) {
      console.log('webln withdraw')
      setLoading(true)
      webln
        .makeInvoice({
          amount: values.get('value'),
          defaultMemo: 'Withdrawal - LightningJackpot.com',
        })
        .then(({ paymentRequest }) => withdraw(paymentRequest))
    } else {
      console.log('standard withdraw')
      setLoading(true)
      console.log('withdraw', values.get('paymentRequest'))
      withdraw(values.get('paymentRequest'))
    }
  }

  return (
    <Modal
      title="Withdraw"
      centered={true}
      visible={show}
      onOk={handleSubmit(submit)}
      onCancel={handleHide}
      confirmLoading={loading}
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
            : {webln.isEnabled ? 'Detected 👍' : 'Not detected 👎'}
          </>
        }
        description={
          webln.isEnabled
            ? `Input the value of Satoshi you'd like to withdraw, and click withdraw. If you have
            funds availible, we'll honor the request. Simple!`
            : `Create an invoice on the lightning application of your choice,
        place the payment request below, and click withdraw. If you have
        funds availible, we'll honor the request.`
        }
        type={webln.isEnabled ? 'success' : 'info'}
      />
      <Form
        onFinish={handleSubmit(submit)}
        size="large"
        layout="vertical"
        style={{ marginTop: 8 }}
      >
        {webln.isEnabled ? (
          <Field
            label="Satoshi"
            name="value"
            type="number"
            placeholder="1000"
            min={1000}
            max={balance}
            step={1000}
            component={NumberField}
            size="large"
            style={{ width: '100%' }}
            validate={[required(), numericality({ int: true, '<=': balance })]}
          />
        ) : (
          <>
            {/* <Typography.Paragraph style={{ margin: "24px 0" }}>
              Create an invoice on the lightning application of your choice,
              place the payment request below, and click withdraw. If you have
              funds availible, we'll honor the request.
            </Typography.Paragraph> */}

            <Field
              name="paymentRequest"
              label="Payment Request"
              placeholder="lnbc13370n1pwc5cjtpp578u2xtsfkk7rp4fvhrs55x32q9smyrsu5japf0qmnp60urru6gaqdpsg3jhqmmnd96zqtfqf35kw6r5de5kue62v93kkur0wshxxmmdcqzpgxqzjcmk0ckhzvth40k0d4734t30zqwyq6482qdm88lhz8tfacxhnjsqkpl7fevv7yfdzncyyyfucjskqfw8ccmtml48cqlqsa6h25q7k228gp8gdc2t"
              component={InputField}
              size="large"
              validate={[required(), paymentRequestValidator()]}
            />
          </>
        )}
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Button
              key="back"
              size="large"
              onClick={nodeInfo}
              icon={<GatewayOutlined />}
              block={true}
            >
              Node
            </Button>
          </Col>
          <Col span={12}>
            <Button
              key="submit"
              size="large"
              type="primary"
              loading={loading}
              onClick={handleSubmit(submit)}
              block={true}
              disabled={pristine || submitting}
            >
              Withdraw
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

const selector = formValueSelector('withdraw')

const mapStateToProps = createStructuredSelector({
  amount: state => selector(state, 'value'),
  paymentRequest: state => selector(state, 'paymentRequest'),
  balance: selectBalance(),
  webln: selectWebLN(),
})

const mapDispatchToProps = dispatch => ({
  nodeInfo: () => dispatch(show('node-info')),
  withdraw: paymentRequest => dispatch(withdraw(paymentRequest)),
})

export default reduxForm({
  form: 'withdraw',
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    connectModal({
      name: 'withdraw',
      destroyOnHide: true,
      getModalState: state => state.get('modal'),
    })(WithdrawModal)
  )
)
