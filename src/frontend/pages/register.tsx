import { Center, Onboarding } from '../components'

import { Blank } from '../components/layouts/blank'
import { NextSeo } from 'next-seo'
import { Typography } from 'antd'

function Register({ query }) {
  return (
    <Center>
      <NextSeo title="Register" description="Join Lightning Jackpot" />
      <Typography.Title style={{ fontWeight: 700, margin: 0 }}>
        Register
      </Typography.Title>
      <Onboarding email={query.email} type="register" />
    </Center>
  )
}

Register.getInitialProps = ({ query }) => {
  return { query }
}

Register.Layout = Blank

export default Register
