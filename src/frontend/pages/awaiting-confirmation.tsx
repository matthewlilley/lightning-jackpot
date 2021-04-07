import { Center, Dots } from '../components'

import { Blank } from '../components/layouts/blank'
import { Typography } from 'antd'

export function AwaitingConfirmation({ query }) {
  return (
    <Center>
      <Typography.Title>
        <Dots text="Awaiting Confirmation" />
      </Typography.Title>
      <Typography.Paragraph>
        We've sent a confirmation email to{' '}
        <Typography.Text strong>{query.email}</Typography.Text>.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Confirm the code matches{' '}
        <Typography.Text mark>{query.code}</Typography.Text>, and click on the
        link to login!
      </Typography.Paragraph>
    </Center>
  )
}

AwaitingConfirmation.Layout = Blank

AwaitingConfirmation.getInitialProps = ({ query }) => {
  return { query }
}

export default AwaitingConfirmation
