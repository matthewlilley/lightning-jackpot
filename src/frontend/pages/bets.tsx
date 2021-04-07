import 'isomorphic-unfetch'

import { Card, Table, Typography } from 'antd'
import React, { Component } from 'react'

import { connect } from 'react-redux'
import getConfig from 'next/config'
import moment from 'moment'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

class Bets extends Component<any> {
  static defaultProps = {
    bets: [],
  }

  static async getInitialProps({ req }) {
    const response = await fetch(`${APP_URL}/api/v0/bets`, {
      headers: {
        cookie: req ? req.headers.cookie : null,
      },
    })
    const bets = await response.json()
    return {
      bets,
    }
  }

  state = {
    bets: this.props.bets,
  }

  dateRenderer = date => moment(date).format('MMMM Do')

  typeRenderer = type => type.charAt(0).toUpperCase() + type.slice(1)

  stateRenderer = state => state.type

  outcomeRenderer = (value, record) => {
    const positive = value > 0
    return (
      <Typography.Text
        style={{
          color: positive ? '#38A169' : '#E53E3E',
        }}
      >
        {positive ? '+' : '-'}
        {Number(record.value.toFixed()).toLocaleString()}
      </Typography.Text>
    )
  }

  statusRenderer = (status, record) => {
    if (status === 'confirmed') {
      return (
        <Typography.Text
          style={{
            color: '#38A169',
          }}
        >
          Confirmed
        </Typography.Text>
      )
    } else {
      if (
        moment()
          .subtract(10, 'minutes')
          .toDate() < moment(record.createdAt).toDate()
      ) {
        return (
          <Typography.Text
            style={{
              color: '#F6E05E',
            }}
          >
            Pending
          </Typography.Text>
        )
      } else {
        return <Typography.Text>Expired</Typography.Text>
      }
    }
  }

  paymentRequestRenderer = paymentRequest => (
    <Typography.Text ellipsis={true} copyable={{ text: paymentRequest }} />
  )

  render() {
    if (!this.state.bets) {
      return null
    }
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Typography.Title>Bets</Typography.Title>
        <Table scroll={{ x: true }} dataSource={this.state.bets} rowKey="id">
          <Table.Column
            title="Date"
            dataIndex="createdAt"
            key="createdAt"
            render={this.dateRenderer}
          />
          <Table.Column
            title="Type"
            dataIndex="state"
            key="state"
            render={this.stateRenderer}
          />
          <Table.Column title="Value" dataIndex="value" key="value" />
          <Table.Column
            title="Outcome"
            dataIndex="outcome"
            key="outcome"
            render={this.outcomeRenderer}
          />
          <Table.Column
            title="Instance"
            dataIndex="instanceId"
            key="instanceId"
          />
          <Table.Column
            title="Winning Number"
            dataIndex={['instance', 'state', 'winningNumber']}
            key="winningNumber"
          />
          <Table.Column
            title="Winning Type"
            dataIndex={['instance', 'state', 'winningType']}
            key="winningType"
          />
        </Table>
      </div>
    )
  }
}

export default connect()(Bets)
