import { Layout, Menu } from 'antd'

import { Default } from './default'
import Link from 'next/link'
import { withRouter } from 'next/router'

export default withRouter(({ children, router }) => {
  function handleClick(e) {
    console.log('click ', e)
  }
  return (
    <Default>
      <Layout
        hasSider={true}
        className="admin"
        style={{ padding: '16px 0', background: 'white', height: '100%' }}
      >
        <Layout.Sider width={224} collapsed={false} theme="light">
          <Menu
            onClick={handleClick}
            style={{ width: '100%', height: '100%' }}
            mode="inline"
            defaultSelectedKeys={[router.pathname]}
          >
            <Menu.Item key="/admin">
              <Link href="/admin">
                <a>Dashboard</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="/admin/users">
              <Link href="/admin/users">
                <a>Users</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="/admin/reports">
              <Link href="/admin/reports">
                <a>Reports</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="/admin/kpi">
              <Link href="/admin/kpi">
                <a>KPI</a>
              </Link>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout.Content
          style={{
            flex: '1 1',
            padding: '8px 40px',
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </Default>
  )
})
