import { Card, Table, Typography } from 'antd'
import React, { Component } from 'react'

import getConfig from 'next/config'
import moment from 'moment'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

class Transactions extends Component<any> {
  static defaultProps = {
    transactions: [],
  }

  static async getInitialProps({ req }) {
    const response = await fetch(`${APP_URL}/api/v0/transactions`, {
      headers: {
        cookie: req ? req.headers.cookie : null,
      },
    })
    const transactions = await response.json()
    return {
      transactions,
    }
  }

  state = {
    copied: this.props.copied,
    transactions: this.props.transactions,
  }

  dateRenderer = date => moment(date).format('MMMM Do')

  typeRenderer = type => type.charAt(0).toUpperCase() + type.slice(1)

  valueRenderer = (value, record) => {
    return (
      <Typography.Text
        style={{
          color:
            record.status === 'confirmed'
              ? record.type === 'deposit'
                ? '#38A169'
                : '#E53E3E'
              : 'inherit',
        }}
      >
        {record.type === 'deposit' ? '+' : '-'}
        {Number(record.value.toFixed()).toLocaleString()}
      </Typography.Text>
    )
  }

  statusRenderer = (status, record) => {
    if (status === 'confirmed') {
      return (
        <Typography.Text style={{ color: '#38A169' }}>
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

  paymentRequestRenderer(paymentRequest) {
    return (
      <Typography.Text
        ellipsis={true}
        copyable={true}
        style={{
          display: 'flex',
          flexGrow: 1,
          maxWidth: 300,
          wordWrap: 'break-word',
          wordBreak: 'break-all',
        }}
      >
        {paymentRequest}
      </Typography.Text>
    )
  }

  render() {
    if (!this.state.transactions) {
      return null
    }
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Typography.Title>Transactions</Typography.Title>
        <Table
          scroll={{ x: true }}
          dataSource={this.state.transactions}
          rowKey="id"
        >
          <Table.Column
            title="Date"
            dataIndex="createdAt"
            key="createdAt"
            render={this.dateRenderer}
          />
          <Table.Column
            title="Type"
            dataIndex="type"
            key="type"
            render={this.typeRenderer}
          />
          <Table.Column
            title="Value"
            dataIndex="value"
            key="value"
            render={this.valueRenderer}
          />
          <Table.Column
            title="Status"
            dataIndex="status"
            key="status"
            render={this.statusRenderer}
          />
          <Table.Column
            title="Payment Request"
            dataIndex="paymentRequest"
            key="paymentRequest"
            render={this.paymentRequestRenderer}
          />
        </Table>
      </div>
    )
  }
}

export default Transactions
