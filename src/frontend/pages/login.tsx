import { Center, Onboarding } from '../components'

import { Blank } from '../components/layouts/blank'
import { NextSeo } from 'next-seo'
import { Typography } from 'antd'

function Login({ query, params }) {
  console.log(query, params)
  return (
    <Center>
      <NextSeo title="Login" description="Login to Lightning Jackpot" />
      <Typography.Title style={{ fontWeight: 700, margin: 0 }}>
        Login
      </Typography.Title>
      <Onboarding email={query.email} type="login" />
    </Center>
  )
}

Login.getInitialProps = ({ query, params }) => {
  return { query, params }
}

Login.Layout = Blank

export default Login
