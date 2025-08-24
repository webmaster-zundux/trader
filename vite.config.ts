import { reactRouter } from '@react-router/dev/vite'
import { readFileSync } from 'fs'
import path, { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'
import viteSvgToWebFont from 'vite-svg-2-webfont'
import tsconfigPaths from 'vite-tsconfig-paths'
import { appDirectory, basename } from './react-router.config'

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

  // const basename = typeof env.USE_BASE_PUBLIC_PATH === 'string' ? env.USE_BASE_PUBLIC_PATH : '/'

  // if (basename !== '/') {
  //   console.log(`vite.config: using basename`, basename)
  // }

  const svgIconFontName = 'iconfont'
  const svgIconsFolderPath = resolve(__dirname, appDirectory, 'svg-icons-for-font')
  const svgIconFontDestFolderPath = resolve(svgIconsFolderPath, '..', 'artifacts', basename.replaceAll('/', '')) //
  const svgIconFontCssDestFolderPath = path.join(svgIconFontDestFolderPath, svgIconFontName + '.css')
  // const svgIconFontCssDestFolderPath = path.join(svgIconFontDestFolderPath, basename.replaceAll('/', ''), svgIconFontName + '.css') // , basename.replaceAll('/', '')

  // console.log({ svgIconsFolderPath, svgIconFontDestFolderPath, svgIconFontCssDestFolderPath }) // for debug only

  return ({
    base: basename,
    plugins: [
      tsconfigPaths(),
      svgr(),
      reactRouter(),
      viteSvgToWebFont({
        allowWriteFilesInBuild: true,
        context: svgIconsFolderPath,
        fontHeight: 24,
        types: ['woff', 'woff2'],
        fontName: svgIconFontName,
        dest: svgIconFontDestFolderPath,
        cssDest: svgIconFontCssDestFolderPath,
        cssFontsUrl: path.join(basename),
        inline: false,
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
