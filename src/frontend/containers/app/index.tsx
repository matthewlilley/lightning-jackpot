import 'emoji-mart/css/emoji-mart.css'
import '../../styles/index.less'

import { setSidebar, setWebLN, socketConnect, userLoaded } from './actions'

import App from 'next/app'
import { Default } from '../../components/layouts/default'
import { DefaultSeo } from 'next-seo'
import Head from 'next/head'
import { Loader } from '../../components'
import { MDXProvider } from '@mdx-js/react'
import { PageTransition } from 'next-page-transitions'
import React from 'react'
import ReactGA from 'react-ga'
import { Provider as ReduxProvider } from 'react-redux'
import Router from 'next/router'
import { Typography } from 'antd'
import { fromJS } from 'immutable'
import getConfig from 'next/config'
import { makeStore } from '../../store'
import nextSeoConfig from '../../next-seo.config'
import { requestProvider } from 'webln'
import { show } from 'redux-modal'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'

import { isMobile } from 'is-mobile'

const Noop = ({ children }) => children

const mdComponents = {
  h1: props => <Typography.Title level={1} {...props} />,
  h2: props => <Typography.Title level={2} {...props} />,
  h3: props => <Typography.Title level={3} {...props} />,
  h4: props => <Typography.Title level={4} {...props} />,
  p: props => <Typography.Paragraph {...props} />,
}

const {
  publicRuntimeConfig: { APP_DEBUG, APP_URL },
} = getConfig()

export const googleAnalytics = () => {
  ReactGA.initialize('UA-125658908-1')
}

export const logPageView = () => {
  console.log(`Logging pageview for ${window.location.pathname}`)
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

Router.events.on('routeChangeComplete', () => {
  logPageView()
})

class LightningJackpot extends App<any, any> {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    if (!ctx.store.getState().getIn(['app', 'user'])) {
      if (ctx.res && ctx.res.locals.user) {
        await ctx.store.dispatch(userLoaded(ctx.res.locals.user))
      }
    }

    return { pageProps }
  }
  async componentDidMount() {
    googleAnalytics()
    logPageView()
    // this.props.store.dispatch(show('welcome'));
    // console.log(this.props.store.getState().getIn(['app', 'user']));
    this.props.store.dispatch(socketConnect())
    if (
      this.props.store.getState().getIn(['app', 'user']) &&
      !this.props.store.getState().getIn(['app', 'user', 'name'])
    ) {
      this.props.store.dispatch(show('name'))
    }

    this.props.store.dispatch(setSidebar(!isMobile()))

    try {
      this.props.store.dispatch(setWebLN(await requestProvider()))
    } catch (error) {
      // Handle users without WebLN
      // console.log('WebLN error', error);
    }
  }

  componentWillUnmount() {
    // console.log('App componentWillUnmount');
  }

  render() {
    const { store, Component, pageProps, router } = this.props
    const Layout = Component.Layout || Default
    return (
      <ReduxProvider store={store}>
        <MDXProvider components={mdComponents}>
          <Head>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/static/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/static/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/static/favicon-16x16.png"
            />
            <link rel="manifest" href="/static/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/static/safari-pinned-tab.svg"
              color="#001529"
            />
            <link rel="shortcut icon" href="/static/favicon.ico" />
            <meta name="msapplication-TileColor" content="#001529" />
            <meta
              name="msapplication-config"
              content="/static/browserconfig.xml"
            />
            <meta name="theme-color" content="#722ed1" />
          </Head>
          <DefaultSeo {...nextSeoConfig} />
          <Layout>
            <PageTransition
              timeout={300}
              classNames="page page-transition"
              // timeout={300}
              // classNames="page-transition"
              // loadingComponent={<Loader />}
              // loadingDelay={500}
              // loadingTimeout={{
              //   enter: 400,
              //   exit: 0,
              // }}
              // loadingClassNames="loading-indicator"
            >
              <Component {...pageProps} key={router.route} />
            </PageTransition>
          </Layout>
        </MDXProvider>
      </ReduxProvider>
    )
  }
}

export default withRedux(makeStore, {
  // debug: true,
  serializeState: state => state.toJS(),
  deserializeState: fromJS,
})(withReduxSaga(LightningJackpot))
