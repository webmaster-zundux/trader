import { reactRouter } from '@react-router/dev/vite'
import type { GeneratedFontTypes } from '@vusion/webfonts-generator'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { appDirectory, basename } from './react-router.config'
import viteSvgToWebFontPatchedVersion5 from './vite-plugins/vite-svg-2-webfont'

const svgIconFontName = 'iconfont'
const svgIconBaseSelector = `.Icon`
const svgIconClassPrefix = 'Icon-'
const svgIconFontTypes: GeneratedFontTypes[] = ['woff', 'woff2']
const svgIconsFolderPath = resolve(__dirname, appDirectory, 'svg-icons-for-font', 'in-use')

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

      // todo - replace by npm package 'vite-svg-2-webfont' with patches for vite.base, and svgo support will be released (details in ./vite-plugins/vite-svg-2-webfont/README.md)
      viteSvgToWebFontPatchedVersion5({
        allowWriteFilesInBuild: true,
        context: svgIconsFolderPath,
        fontHeight: 100,
        types: svgIconFontTypes,
        fontName: svgIconFontName,
        baseSelector: svgIconBaseSelector,
        classPrefix: svgIconClassPrefix,

        // does not works
        // centerHorizontally: true,
        // fixedWidth: true,
        // normalize: true,
        // // descent: 0,
        // // round: 1e3,

        svgo: { // todo replace by using `svgo.config.mjs`
          multipass: true,
          plugins: [ // snippet in ./scripts/svgo/svgoPlaygroundCollectTurnedOnPluginsNames.snippet.js
            'preset-default',

            'cleanupAttrs',
            'cleanupEnableBackground',
            'cleanupIds',
            'cleanupNumericValues',
            'collapseGroups',
            'convertColors',
            'convertEllipseToCircle',
            'convertPathData',
            'convertShapeToPath',
            'convertTransform',
            'inlineStyles',
            'mergePaths',
            'mergeStyles',
            'minifyStyles',
            'moveElemsAttrsToGroup',
            'moveGroupAttrsToElems',
            'removeComments',
            'removeDesc',
            'removeDimensions',
            'removeDoctype',
            'removeEditorsNSData',
            'removeEmptyAttrs',
            'removeEmptyContainers',
            'removeEmptyText',
            'removeHiddenElems',
            'removeMetadata',
            'removeNonInheritableGroupAttrs',
            'removeTitle',
            'removeUnknownsAndDefaults',
            'removeUnusedNS',
            'removeUselessDefs',
            'removeUselessStrokeAndFill',
            'removeViewBox',
            'removeXMLProcInst',
            'reusePaths',
            'sortAttrs',
            'sortDefsChildren'
          ],
        }
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
