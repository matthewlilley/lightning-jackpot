import AdminLayout from '../../components/layouts/admin'
import { Line } from 'react-chartjs-2'
import React from 'react'
import { Typography } from 'antd'
import getConfig from 'next/config'
import moment from 'moment'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

const baseDataset = {
  backgroundColor: 'rgba(114,46,209,0.2)',
  borderColor: 'rgba(114,46,209,0.2)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  borderWidth: 0,
  lineTension: 0.4,
  pointBorderColor: 'rgba(114,46,209,0.2)',
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: 'rgba(114,46,209,0.4)',
  pointHoverBorderColor: 'rgba(114,46,209,0.4)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
}

function KPI({ kpi }) {
  console.log('KPI', kpi)

  const labels = kpi.map(indicator =>
    moment
      .utc(indicator.createdAt)
      .local()
      .fromNow()
  )
  console.log('KPI labels', labels)
  const users = {
    labels,
    datasets: [
      {
        ...baseDataset,
        label: 'Users',
        data: kpi.map(indicator => indicator.users),
      },
    ],
  }

  const bets = {
    labels,
    datasets: [
      {
        ...baseDataset,
        label: 'Bets',
        data: kpi.map(indicator => indicator.betVolume),
      },
    ],
  }

  const deposits = {
    labels,
    datasets: [
      {
        ...baseDataset,
        label: 'Deposits',
        data: kpi.map(indicator => indicator.depositVolume),
      },
    ],
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={3}>Users</Typography.Title>
        <Line data={users} options={{ responsive: true }} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={3}>Bet Volume</Typography.Title>
        <Line data={bets} options={{ responsive: true }} />
      </div>

      <Typography.Title level={3}>Deposit Volume</Typography.Title>
      <Line data={deposits} options={{ responsive: true }} />
    </div>
  )
}

KPI.getInitialProps = async ({ req }) => {
  const response = await fetch(`${APP_URL}/api/v0/performance-indicators`, {
    headers: {
      cookie: req ? req.headers.cookie : null,
    },
  })
  const kpi = await response.json()
  return { kpi }
}

KPI.Layout = AdminLayout

export default KPI
