import { reactRouter } from '@react-router/dev/vite'
import { readFileSync } from 'fs'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  let useBasicSslCerts = false

  if (env.USE_BASIC_SSL_CERTS === '1') {
    console.log(`using self-signed ca certificate`)
    useBasicSslCerts = true
  }

  let customHostName: string | undefined

  if (env.USE_SERVER_HOST_NAME) {
    customHostName = env.USE_SERVER_HOST_NAME
  }

  const basename = typeof env.USE_BASE_PUBLIC_PATH === 'string' ? env.USE_BASE_PUBLIC_PATH : '/'

  if (basename !== '/') {
    console.log(`vite.config: using basename`, basename)
  }

  return ({
    base: basename,
    // ssr: {
    //   noExternal: command === 'build' ? true : undefined,
    // },
    plugins: [
      tsconfigPaths(),
      svgr(),
      reactRouter(),
    ],
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    server: {
      allowedHosts: (useBasicSslCerts && customHostName) ? [customHostName] : undefined,
      ...[
        (useBasicSslCerts && customHostName)
          ? {
              https: {
                key: readFileSync(`./.ssl/${customHostName}-key.pem`),
                cert: readFileSync(`./.ssl/${customHostName}.pem`),
              },
            }
          : undefined,
      ]
    }
  })
})
