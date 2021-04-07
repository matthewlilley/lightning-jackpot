import { Divider, Layout, Typography } from 'antd'
import { PhoneOutlined, QuestionOutlined } from '@ant-design/icons'

import { BalanceScale } from 'styled-icons/fa-solid'
import Link from 'next/link'

const AppFooter = () => (
  <Layout.Footer style={{ zIndex: 1 }}>
    <div
      style={{
        maxWidth: '1600px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Typography.Text style={{ margin: '0 8px' }}>
        LIGHTNING JACKPOT ©2020
      </Typography.Text>
      <div style={{ margin: '0 8px' }}>
        <Link href="/provably-fair">
          <a>
            <BalanceScale size="1em" /> FAIR
          </a>
        </Link>
        <Divider type="vertical" />
        <Link href="/faq">
          <a>
            <QuestionOutlined /> FAQ
          </a>
        </Link>
        <Divider type="vertical" />
        <Link href="/contact">
          <a>
            <PhoneOutlined /> CONTACT
          </a>
        </Link>
      </div>
    </div>
  </Layout.Footer>
)

export default AppFooter
