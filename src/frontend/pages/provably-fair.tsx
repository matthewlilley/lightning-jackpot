import { Card, Tabs, Typography } from 'antd'
import Router, { withRouter } from 'next/router'
import { Seeds, Verifier } from '../components'

import { NextSeo } from 'next-seo'
import Overview from '../markdown/overview.mdx'
import React from 'react'

function handle(tab) {
  const href = `/provably-fair?tab=${tab}`
  Router.push(href, href, { shallow: true })
}

function ProvablyFair(props) {
  // const tab = router.query.tab;
  // console.log('render', props)
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <NextSeo title="Provably Fair" />
      <Typography.Title>Provably Fair</Typography.Title>
      <Tabs
        activeKey={props.router.query.tab || 'overview'}
        onChange={handle}
        tabBarStyle={{ marginBottom: 24 }}
        size="large"
      >
        <Tabs.TabPane tab="Overview" key="overview">
          <Overview />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Seeds" key="seeds">
          <Seeds />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Don't Trust. Verify!" key="verify">
          <Verifier />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

ProvablyFair.getInitialProps = async ({ query }) => {
  return { query }
}

export default withRouter(ProvablyFair)
