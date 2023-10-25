import path from 'path'
import AutoLoad from '@fastify/autoload'
import config from './config.mjs'
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
// Pass --options via CLI arguments in command to enable these options.
export const options = {}

export default async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, { ...opts, ...config }),
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, { ...opts, ...config }),
  })
}
