// const preact = require('@zeit/next-preact');
const css = require('@zeit/next-css')
const optimizedImages = require('next-optimized-images')
const mdx = require('@zeit/next-mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require('remark-images'), require('remark-emoji')],
  },
})
const less = require('@zeit/next-less')
const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')
// const darkTheme = require('@ant-design/dark-theme')

const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, 'src/frontend/styles/default.less'),
    'utf8'
  )
)

const publicRuntimeConfig = {
  // to be used on the client
  APP_NAME: process.env.APP_NAME,
  APP_PORT: process.env.APP_PORT,
  APP_URL: process.env.APP_URL,
  APP_API_VERSION: process.env.APP_API_VERSION,
  LND_PUBLIC_KEY: process.env.LND_PUBLIC_KEY,
  LND_HOST: process.env.LND_HOST,
  LND_P2P_PORT: process.env.LND_P2P_PORT,
  ROULETTE_JACKPOT_CUT: process.env.ROULETTE_JACKPOT_CUT,
  ROULETTE_COUNTDOWN_DURATION: process.env.ROULETTE_COUNTDOWN_DURATION,
  ROULETTE_SPIN_DURATION: process.env.ROULETTE_SPIN_DURATION,
  ROULETTE_END_DURATION: process.env.ROULETTE_END_DURATION,
  ROULETTE_TEASER_PROBABILITY: process.env.ROULETTE_TEASER_PROBABILITY,
  WS_URL: process.env.WS_URL,
}

const serverRuntimeConfig = {}

const baseNextConfig = {
  compress: false,
  distDir: '../../dist/frontend',
  experimental: {
    granularChunks: true,
    modern: true,
  },
  pageExtensions: ['tsx', 'ts'],
  publicRuntimeConfig,
  serverRuntimeConfig,
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]
      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
    }
    return config
  },
}

const bundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = bundleAnalyzer(
  css(
    less(
      optimizedImages(
        mdx({
          ...baseNextConfig,
          pageExtensions: ['md', 'mdx', 'tsx'],
          lessLoaderOptions: {
            javascriptEnabled: true,
            modifyVars: {
              // ...darkTheme,
              ...themeVariables,
            },
          },
        })
      )
    )
  )
)
