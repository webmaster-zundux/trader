import { reactRouter } from '@react-router/dev/vite'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'
// import viteSvgToWebFont from 'vite-svg-2-webfont'
import viteSvgToWebFontPatchedVersion5 from './vite-plugins/vite-svg-2-webfont' // todo - replace by npm package 'vite-svg-2-webfont' when patch will be released (details in ./vite-plugins/vite-svg-2-webfont/README.md)
import tsconfigPaths from 'vite-tsconfig-paths'
import { appDirectory, basename } from './react-router.config'
import type { GeneratedFontTypes } from '@vusion/webfonts-generator'

const svgIconFontName = 'iconfont'
const svgIconFontTypes: GeneratedFontTypes[] = ['woff', 'woff2']
const svgIconsFolderPath = resolve(__dirname, appDirectory, 'svg-icons-for-font')

export default defineConfig(({ mode }) => {
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

  return ({
    base: basename,
    plugins: [
      tsconfigPaths(),
      svgr(),
      reactRouter(),
      viteSvgToWebFontPatchedVersion5({
        allowWriteFilesInBuild: true,
        context: svgIconsFolderPath,
        fontHeight: 100,
        types: svgIconFontTypes,
        fontName: svgIconFontName,
      })
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
