import AdminLayout from '../../components/layouts/admin'
import { Typography } from 'antd'
import getConfig from 'next/config'

const {
  publicRuntimeConfig: { APP_URL },
} = getConfig()

function Admin() {
  return (
    <div>
      <Typography.Title level={3}>Admin</Typography.Title>
      <Typography.Paragraph>Dashboard...</Typography.Paragraph>
    </div>
  )
}

Admin.Layout = AdminLayout

Admin.getInitialProps = async () => {
  return {}
}

export default Admin
