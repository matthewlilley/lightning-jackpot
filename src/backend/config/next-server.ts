// import { nextConfig } from './next'
import path from 'path'
// export type ServerConstructor = {
//   /**
//    * Where the Next project is located - @default '.'
//    */
//   dir?: string
//   staticMarkup?: boolean
//   /**
//    * Hide error messages containing server information - @default false
//    */
//   quiet?: boolean
//   /**
//    * Object what you would use in next.config.js - @default {}
//    */
//   conf?: NextConfig
//   dev?: boolean
// }

export const nextServerConfig = {
  // dir: path.resolve(__dirname, '../../frontend'),
  dir: process.env.NEXT_DIRECTORY,
  // conf: nextConfig,
  dev: process.env.NODE_ENV !== 'production',
}
