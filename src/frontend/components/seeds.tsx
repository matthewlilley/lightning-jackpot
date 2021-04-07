import { Card, Table, Typography } from 'antd'
import moment from 'moment'
import getConfig from 'next/config'
import { useEffect, useState } from 'react'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

export function Seeds(props) {
  function dateRenderer(date) {
    return moment(date).format('MMMM Do')
  }

  function seedRenderer(seed) {
    return (
      <Typography.Text
        ellipsis={true}
        copyable={true}
        style={{
          display: 'flex',
          flexGrow: 1,
          wordWrap: 'break-word',
          wordBreak: 'break-all',
        }}
      >
        {seed}
      </Typography.Text>
    )
  }

  const [seeds, setSeeds]: any[] = useState([])
  const [hash, setHash] = useState('')

  useEffect(() => {
    async function fetchSeeds() {
      try {
        const response = await fetch(`${APP_URL}/api/v0/seeds`)
        setSeeds(await response.json())
      } catch (e) {
        console.error(e)
      }
    }
    async function fetchHash() {
      try {
        const response = await fetch(`${APP_URL}/api/v0/hashes`)
        setHash(await response.json())
      } catch (e) {
        console.error(e)
      }
    }
    fetchSeeds()
    fetchHash()
  }, [])

  console.log(seeds, hash)

  return (
    <div {...props}>
      <Typography.Title level={4}>Active</Typography.Title>
      <Table
        dataSource={[
          {
            key: 'active',
            ...seeds[0],
            serverHash: hash,
          },
        ]}
        rowKey="key"
        pagination={false}
        style={{ marginBottom: '24px' }}
      >
        <Table.Column
          title="Date"
          dataIndex="createdAt"
          key="createdAt"
          render={dateRenderer}
        />
        <Table.Column
          title="Server Hash"
          dataIndex={['serverHash', 'value']}
          key="serverHash"
          render={seedRenderer}
        />
        <Table.Column
          title="Client Seed"
          dataIndex={['clientSeed', 'value']}
          key="clientSeed"
          render={seedRenderer}
        />
        {/* <Table.Column title='Instances' render={() => '100 - Present'} /> */}
      </Table>
      <Typography.Title level={4}>Previous</Typography.Title>
      <Table dataSource={seeds.slice(1, seeds.length)} rowKey="id">
        <Table.Column
          title="Date"
          dataIndex="createdAt"
          key="createdAt"
          render={dateRenderer}
        />
        <Table.Column
          title="Server Seed"
          dataIndex={['serverSeed', 'value']}
          key="serverSeed"
          render={seedRenderer}
        />
        <Table.Column
          title="Client Seed"
          dataIndex={['clientSeed', 'value']}
          key="clientSeed"
          render={seedRenderer}
        />
        {/* <Table.Column title='Instances' render={() => '0 - 99'} /> */}
      </Table>
    </div>
  )
}
