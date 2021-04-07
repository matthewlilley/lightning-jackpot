import { Menu, Typography } from 'antd'
import React, { Component } from 'react'

import AdminLayout from '../../components/layouts/admin'
import { Bar } from 'react-chartjs-2'
import Link from 'next/link'
import getConfig from 'next/config'
import moment from 'moment'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

const baseDataset = {
  borderWidth: 0,
  hoverBackgroundColor: 'rgba(114,46,209, 0.8)',
}

class Reports extends Component<any> {
  static Layout = AdminLayout

  static defaultProps = {
    type: 'minuite',
  }

  static async getInitialProps({ req, query }) {
    const response = await fetch(
      `${APP_URL}/api/v0/admin/reports?filter=${JSON.stringify({
        type: query.type || Reports.defaultProps.type,
        take: 100,
      })}`,
      {
        headers: {
          cookie: req ? req.headers.cookie : null,
        },
      }
    )
    const reports = await response.json()
    return {
      data: reports.reduce(
        (previousValue, currentValue) => {
          previousValue.datasets[0].data.push(currentValue.totalEV)
          previousValue.datasets[1].data.push(currentValue.totalValue)
          return {
            labels: [
              ...previousValue.labels,
              moment
                .utc(currentValue.createdAt)
                .local()
                .fromNow(),
            ],
            datasets: [...previousValue.datasets],
          }
        },
        {
          labels: [],
          datasets: [
            {
              ...baseDataset,
              label: 'EV',
              backgroundColor: 'rgba(114,46,209, 0.2)',
              hoverBackgroundColor: 'rgba(114,46,209, 0.4)',
              data: [],
            },
            {
              ...baseDataset,
              label: 'Value',
              backgroundColor: 'rgba(114,46,209, 0.4)',
              data: [],
            },
          ],
          totalEV: [],
          totalValue: [],
        }
      ),
    }
  }

  render() {
    return (
      <div>
        <Typography.Title level={3}>Reports</Typography.Title>
        <Menu
          selectedKeys={[this.props.type]}
          mode="horizontal"
          style={{ marginBottom: 24 }}
        >
          <Menu.Item key="minuite">
            <Link
              href={{ pathname: '/admin/reports', query: { type: 'minuite' } }}
            >
              <a>Minuite</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="hour">
            <Link
              href={{ pathname: '/admin/reports', query: { type: 'hour' } }}
            >
              <a>Hour</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="day">
            <Link href={{ pathname: '/admin/reports', query: { type: 'day' } }}>
              <a>Day</a>
            </Link>
          </Menu.Item>
        </Menu>
        <Bar data={this.props.data} width={100} height={50} />
      </div>
    )
  }
}

Reports.Layout = AdminLayout

export default Reports
