import { Button, Col, Layout, Row, Typography } from 'antd'
import styled, { keyframes } from 'styled-components'
import { CloseOutlined, ThunderboltTwoTone } from '@ant-design/icons'

import Link from 'next/link'

const brandAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(5deg) scale(1.2);
  }
`

const A = styled.a`
  &:hover svg {
    animation: ${brandAnimation} linear 1s infinite alternate;
  }
`

export function Blank({ children, footer }) {
  return (
    <div className="blank" style={{ height: 'calc(100vh - 128px)' }}>
      <Layout.Header
        style={{
          display: 'flex',
          background: 'transparent',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link href="/">
          <A>
            <Row justify="start" align="top" style={{ height: '64px' }}>
              <Col>
                <ThunderboltTwoTone
                  twoToneColor="#722ed1"
                  style={{ fontSize: '32px', padding: '16px 4px 16px 0' }}
                />
              </Col>
              <Col>
                <Typography.Text className="app-header-logo-text" strong={true}>
                  LIGHTNING JACKPOT
                </Typography.Text>
              </Col>
            </Row>
          </A>
        </Link>
        <Link href="/">
          <Button
            type="link"
            icon={<CloseOutlined />}
            style={{ fontSize: '16px' }}
          />
        </Link>
      </Layout.Header>

      {children}
      <Layout.Footer
        style={{
          height: 64,
          background: 'transparent',
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {footer}
      </Layout.Footer>
    </div>
  )
}
