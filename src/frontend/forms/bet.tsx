import { Button, Col, Form, Radio, Row } from 'antd'
import {
  Field,
  change,
  formValueSelector,
  reduxForm,
} from 'redux-form/immutable'
import Icon, { ThunderboltOutlined } from '@ant-design/icons'
import { NumberField, RadioGroupField } from '.'
import { addValidator, numericality, required } from 'redux-form-validators'
import { hide, show } from 'redux-modal'
import { selectBalance, selectUser } from '../containers/app/selectors'
import {
  selectDisabled,
  selectInstance,
  selectStartedAt,
} from '../containers/roulette/selectors'

import Bear from '../images/bear.svg?sprite'
import Bull from '../images/bull.svg?sprite'
import Moon from '../images/rocket.svg?sprite'
import ReactGA from 'react-ga'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import numeral from 'numeral'
import { placeBet } from '../containers/roulette/actions'
import { useRouter } from 'next/router'

const formItemLayout = {
  labelCol: {
    sm: {
      span: 24,
    },
    md: {
      span: 24,
    },
    lg: {
      span: 24,
    },
  },
  wrapperCol: {
    sm: {
      span: 24,
    },
    md: {
      span: 24,
    },
    lg: {
      span: 24,
    },
  },
}

const buttonLayout = {
  xs: { span: 24 },
  sm: { span: 8 },
  // md: { span: 16 },
  // lg: { span: 16 }
}

const colLayout = {
  xs: { span: 24 },
  sm: { span: 8 },
  md: { span: 8 },
  lg: { span: 8 },
}

const selector = formValueSelector('test')

const mapStateToProps = createStructuredSelector({
  balance: selectBalance(),
  disabled: selectDisabled(),
  instance: selectInstance(),
  startedAt: selectStartedAt(),
  type: state => selector(state, 'type'),
  user: selectUser(),
  value: state => selector(state, 'value'),
})

const mapDispatchToProps = dispatch => ({
  placeBet: bet => dispatch(placeBet(bet)),
  change: values => dispatch(change(values)),
  hide: () => dispatch(hide('play')),
  show: () => dispatch(show('play')),
})

const balanceValidator = addValidator({
  defaultMessage: "You don't have enough balance.",
  validator: (options: { balance: number }, value, allValues) => {
    return options.balance >= 1000
  },
})

export const BetForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'test',
    enableReinitialize: true,
    initialValues: { type: 'Moon', value: 1337 },
  })(
    ({
      balance,
      change,
      disabled,
      handleSubmit,
      hide,
      instance,
      placeBet,
      pristine,
      submitting,
      type,
      user,
      value,
    }) => {
      function allowed(type) {
        return ['Bear', 'Moon', 'Bull'].includes(type)
      }

      function totalBetValueForUser() {
        return instance.bets.reduce(
          (previousValue, currentValue) =>
            currentValue.user.id === user.id
              ? previousValue + currentValue.value
              : previousValue,
          0
        )
      }

      function betLimitReached() {
        if (!user) {
          return false
        }
        return totalBetValueForUser() === 2000
      }

      const router = useRouter()

      function submit(values) {
        if (!user) {
          show('login')
          router.push('/login')
          return
        }
        if (balance < 1000) {
          show('deposit')
          return
        }
        placeBet({
          value: Number(value),
          state: {
            type,
          },
        })
        ReactGA.event({ category: 'roulette', action: 'bet' })
        if (balance === 0) {
          change({ value: 0 })
        }
        hide('play')
      }

      return (
        <Form
          {...formItemLayout}
          className="bet-form"
          onFinish={handleSubmit(submit)}
          size="large"
        >
          <Row gutter={16}>
            <Col {...colLayout}>
              <Field
                label="Bet"
                name="value"
                component={NumberField}
                placeholder={1000}
                min={1000}
                max={balance >= 1000 ? balance : 1000}
                step={1000}
                disabled={disabled}
                size="large"
                validate={[
                  required(),
                  // balanceValidator({ balance }),
                  // numericality({
                  //   int: true,
                  //   '>=': 1000,
                  //   // '<=': Number(balance),
                  // }),
                ]}
              />
            </Col>

            <Col {...colLayout}>
              <Field
                component={RadioGroupField}
                disabled={disabled}
                label="Type"
                name="type"
                size="large"
              >
                <Radio.Button value="Bear">
                  <Icon component={Bear} />
                </Radio.Button>
                <Radio.Button value="Moon">
                  <Icon component={Moon} />
                </Radio.Button>
                <Radio.Button value="Bull">
                  <Icon component={Bull} />
                </Radio.Button>
              </Field>
            </Col>
            <Col {...colLayout}>
              <Form.Item label="Win">
                <span className="ant-form-text">
                  {value} x {type === 'Moon' ? '14' : '2'} ={' '}
                  {numeral(type === 'Moon' ? value * 14 : value * 2).format(
                    '0.00a'
                  )}
                </span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col {...buttonLayout}>
              {/* <Row  justify="center" gutter={8}>
                <Col>
                  <Button size="small">1/2</Button>
                </Col>
                <Col>
                  <Button size="small">MAX</Button>
                </Col>
              </Row> */}
            </Col>
            <Col {...buttonLayout}>
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                htmlType="submit"
                size="large"
                disabled={disabled}
              >
                Play
              </Button>
            </Col>
            <Col {...buttonLayout}>{/* <a>How?</a> */}</Col>
          </Row>
        </Form>
      )
    }
  )
)
