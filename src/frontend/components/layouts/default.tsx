import Footer from './footer'
import Header from './header'
import { Layout } from 'antd'
import Modals from '../../modals'
import NoSSR from 'react-no-ssr'
import React from 'react'
import Scrollbars from 'react-custom-scrollbars'
import Sidebar from './sidebar'

export function Default({ children }) {
  return (
    <NoSSR>
      <Layout
        style={{
          height: '100vh',
        }}
        className="lightning-jackpot"
        hasSider={true}
      >
        <Layout>
          <Header />
          <Layout>
            <Scrollbars
              autoHide={true}
              autoHideTimeout={1000}
              autoHideDuration={200}
              universal={true}
            >
              <Layout.Content
                style={{
                  maxWidth: '1200px',
                  margin: '0 auto',
                  padding: '16px',
                }}
              >
                {children}
              </Layout.Content>
            </Scrollbars>
          </Layout>
          <Footer />
        </Layout>
        <Sidebar />
        <Modals />
      </Layout>
    </NoSSR>
  )
}
