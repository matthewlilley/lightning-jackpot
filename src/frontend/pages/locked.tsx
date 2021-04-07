import { Blank } from '../components/layouts/blank'
import { Center } from '../components'
import React from 'react'
import { ThunderboltTwoTone } from '@ant-design/icons'
import { Typography } from 'antd'

function Locked() {
  return (
    <Center>
      <ThunderboltTwoTone
        twoToneColor="#722ed1"
        style={{ fontSize: 64, marginBottom: 24 }}
      />
      <Typography.Title>Your account has been locked!</Typography.Title>
      <Typography.Paragraph>
        Contact support: support@lightningjackpot.com
      </Typography.Paragraph>
    </Center>
  )
}

Locked.Layout = Blank

export default Locked
