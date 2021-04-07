import { Button, Typography } from 'antd'
import {
  FacebookFilled,
  GoogleSquareFilled,
  TwitterSquareFilled,
} from '@ant-design/icons'

import Link from 'next/link'
import { LoginForm } from '../forms'

export function Onboarding({ email, type }) {
  return !email ? (
    <>
      <div style={{ maxWidth: 240, margin: '24px 0' }}>
        <Link href="/auth/google">
          <Button size="large" block style={{ marginBottom: 24 }}>
            Continue with <GoogleSquareFilled style={{ color: '#dd4b39' }} />
          </Button>
        </Link>
        <Link href="/auth/facebook">
          <Button size="large" block style={{ marginBottom: 24 }}>
            Continue with <FacebookFilled style={{ color: '#3b5999' }} />
          </Button>
        </Link>
        <Link href="/auth/twitter">
          <Button size="large" block>
            Continue with <TwitterSquareFilled style={{ color: '#55acee' }} />
          </Button>
        </Link>
      </div>
      {/* <Typography.Text>
        You can also{' '}
        <Link href={{ pathname: `/${type}`, query: { email: 1 } }}>
          <a>continue with email</a>
        </Link>
      </Typography.Text> */}
    </>
  ) : (
    <>
      {/* <LoginForm />
      <Typography.Text>
        You can also{' '}
        <Link href={{ pathname: `/${type}` }}>
          <a>continue with Google, Facebook, or Twitter</a>
        </Link>
      </Typography.Text> */}
    </>
  )
}
