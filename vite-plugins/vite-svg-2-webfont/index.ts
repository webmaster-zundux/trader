import type { GeneratedFontTypes, WebfontsGeneratorResult } from '@vusion/webfonts-generator'
import webfontGenerator from '@vusion/webfonts-generator'
import { readFile } from 'fs/promises'
import { mkdir, writeFile } from 'node:fs/promises'
import path, { join as pathJoin } from 'node:path'
import { promisify } from 'node:util'
import { optimize as svgOptimize } from 'svgo'
import type { ModuleGraph, ModuleNode } from 'vite'
import type { IconPluginOptions } from './optionParser'
import { parseFiles, parseWebfontGeneratorOptions } from './optionParser'
import type { GeneratedWebfont } from './types/generatedWebfont'
import type { CompatiblePlugin, PublicApi } from './types/publicApi'
import { MIME_TYPES, ensureDirExistsAndWriteFile, getBufferHash, getTmpDir, rmDir, setupWatcher } from './utils'

const ac = new AbortController()
const webfontGeneratorPromisified = promisify(webfontGenerator)
const DEFAULT_MODULE_ID = 'vite-svg-2-webfont.css'
const TMP_DIR = getTmpDir()
const TEMPORARY_FOLDER_NAME = '__vite-svg-2-webfont-'

function getVirtualModuleId<T extends string>(moduleId: T): `virtual:${T}` {
  return `virtual:${moduleId}`
}

function getResolvedVirtualModuleId<T extends string>(virtualModuleId: T): `\0${T}` {
  return `\0${virtualModuleId}`
}

/**
 * A Vite plugin that generates a webfont from your SVG icons.
 *
 * The plugin uses {@link https://github.com/vusion/webfonts-generator/ webfonts-generator} package to create fonts in any format.
 * It also generates CSS files that allow using the icons directly in your HTML output, using CSS classes per-icon.
 */
export function viteSvgToWebfont<T extends GeneratedFontTypes = GeneratedFontTypes>(
  options: IconPluginOptions<T>
): CompatiblePlugin<PublicApi> {
  const webfontGeneratorParsedOptions = parseWebfontGeneratorOptions(options)
  let isBuild: boolean
  let base: string
  let cacheDir: string
  let fileRefs: { [Ref in T]: string } | undefined
  let _moduleGraph: ModuleGraph
  let _reloadModule: undefined | ((module: ModuleNode) => Promise<void>)
  let generatedFonts: undefined | Pick<WebfontsGeneratorResult<T>, 'generateCss' | 'generateHtml' | T>
  const generatedWebfonts: GeneratedWebfont[] = []
  const tmpGeneratedWebfonts: GeneratedWebfont[] = []
  const moduleId = options.moduleId ?? DEFAULT_MODULE_ID
  const virtualModuleId = getVirtualModuleId(moduleId)
  const resolvedVirtualModuleId = getResolvedVirtualModuleId(virtualModuleId)

  const inline = <U extends string | undefined>(css: U) => {
    if (!options.inline) {
      return css
    }

    return css?.replace(/url\(".*?\.([^?]+)\?[^"]+"\)/g, (_, type: T) => {
      const font = Buffer.from(generatedFonts?.[type] || [])

      return `url("data:${MIME_TYPES[type]};charset=utf-8;base64,${font.toString('base64')}")`
    }) as U
  }

  const generate = async (updateFiles?: boolean) => {
    if (updateFiles) {
      webfontGeneratorParsedOptions.files = parseFiles(options)
    }

    if (isBuild && !options.allowWriteFilesInBuild) {
      webfontGeneratorParsedOptions.writeFiles = false
    }

    const temporaryOptimizedSvgFilesFolderPath = path.join(cacheDir, TEMPORARY_FOLDER_NAME)

    try {
      await mkdir(temporaryOptimizedSvgFilesFolderPath, { recursive: true })
    } catch (error: unknown) {
      console.warn(`vite-svg-2-webfont: ${temporaryOptimizedSvgFilesFolderPath} temporary folder for optimized svg files not created`, error)
      return
    }

    const originalSvgFilesPaths = webfontGeneratorParsedOptions.files.concat()
    const temporaryOptimizedSvgFilesPaths = new Array<string>()

    for (const originalSvgFilePath of originalSvgFilesPaths) {
      let svgFileContent: string

      try {
        svgFileContent = await readFile(originalSvgFilePath, { encoding: 'utf8' })
      } catch (error: unknown) {
        console.warn(`vite-svg-2-webfont: ${originalSvgFilePath} file not found`, error)
        return
      }

      let optimizedSvgFileContent: string

      try {
        optimizedSvgFileContent = svgOptimize(svgFileContent, {
          path: originalSvgFilePath,
          ...options.svgo,
        }).data
      } catch (error: unknown) {
        console.warn(`vite-svg-2-webfont: ${originalSvgFilePath} file not optimized by svgo`, error)
        return
      }

      const fileName = path.basename(originalSvgFilePath)
      const temporaryOptimizedSvgFilePath = path.join(temporaryOptimizedSvgFilesFolderPath, fileName)

      try {
        await writeFile(temporaryOptimizedSvgFilePath, optimizedSvgFileContent, { encoding: 'utf8' })
        temporaryOptimizedSvgFilesPaths.push(temporaryOptimizedSvgFilePath)
      } catch (error: unknown) {
        console.warn(`vite-svg-2-webfont: ${temporaryOptimizedSvgFilePath} temporary optimized file was not created`, error)
        return
      }
    }

    if (webfontGeneratorParsedOptions.files.length !== temporaryOptimizedSvgFilesPaths.length) {
      const expectedNumber = webfontGeneratorParsedOptions.files.length
      const resultNumber = temporaryOptimizedSvgFilesPaths.length

      console.warn(
        `vite-svg-2-webfont: some temporary optimized svg files were not created.`,
        `Should have been created ${expectedNumber} file${expectedNumber > 1 ? 's' : ''} but ${resultNumber} file${resultNumber > 1 ? 's' : ''} ${resultNumber > 1 ? 'were' : 'was'} created`
      )
      return
    } else {
      webfontGeneratorParsedOptions.files = temporaryOptimizedSvgFilesPaths
    }

    generatedFonts = await webfontGeneratorPromisified(webfontGeneratorParsedOptions)
    const hasFilesToSave = !webfontGeneratorParsedOptions.writeFiles && (webfontGeneratorParsedOptions.css || webfontGeneratorParsedOptions.html)

    if (!isBuild && hasFilesToSave) {
      await Promise.all([
        webfontGeneratorParsedOptions.css && ensureDirExistsAndWriteFile(inline(generatedFonts.generateCss()), webfontGeneratorParsedOptions.cssDest),
        webfontGeneratorParsedOptions.html && ensureDirExistsAndWriteFile(generatedFonts.generateHtml(), webfontGeneratorParsedOptions.htmlDest),
      ])
    }

    if (updateFiles) {
      const module = _moduleGraph?.getModuleById(resolvedVirtualModuleId)

      if (module && _reloadModule) {
        _reloadModule(module).catch(() => null)
      }
    }
  }

  return {
    name: 'vite-svg-2-webfont',
    enforce: 'pre',
    api: {
      getGeneratedWebfonts(): GeneratedWebfont[] {
        return generatedWebfonts
      },
    },
    configResolved(_config) {
      isBuild = _config.command === 'build'
      base = _config.base
      cacheDir = _config.cacheDir
    },
    resolveId(id) {
      if (id !== virtualModuleId) {
        return undefined
      }

      return resolvedVirtualModuleId
    },
    generateBundle(_, bundle) {
      for (const { type, href } of tmpGeneratedWebfonts) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.name && href.endsWith(chunk.name)) {
            generatedWebfonts.push({ type, href: `${base}${chunk.fileName}` })
          }
        }
      }
    },
    transform(_code, id) {
      if (id !== resolvedVirtualModuleId) {
        return undefined
      }

      return inline(generatedFonts?.generateCss?.(fileRefs)) || ''
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) {
        return undefined
      }

      return resolvedVirtualModuleId
    },
    async buildStart() {
      if (!isBuild) {
        setupWatcher(options.context, ac.signal, () => generate(true)).catch(() => null)
      }
      await generate()
      if (isBuild && !options.inline) {
        const emitted = webfontGeneratorParsedOptions.types.map<[T, string]>((type) => {
          if (!generatedFonts?.[type]) {
            throw new Error(`Failed to generate font of type ${type}`)
          }

          const fileContents = Buffer.from(generatedFonts[type])
          const hash = getBufferHash(fileContents)
          const filePath = pathJoin(TMP_DIR, `${webfontGeneratorParsedOptions.fontName}-${hash}.${type}`)

          ensureDirExistsAndWriteFile(fileContents, filePath).catch(() => null) // write font file to a temporary dir

          return [type, filePath]
        })

        emitted.forEach(([type, href]) => {
          tmpGeneratedWebfonts.push({ type, href })
        })
        fileRefs = Object.fromEntries(emitted) as { [Ref in T]: string }
      }
    },
    configureServer({ middlewares, reloadModule, moduleGraph }) {
      if (options.inline) {
        return
      }

      for (const fontType of webfontGeneratorParsedOptions.types) {
        const fileName = `${webfontGeneratorParsedOptions.fontName}.${fontType}`

        middlewares.use(`${base}${fileName}`, (_req, res) => {
          _moduleGraph = moduleGraph
          _reloadModule = reloadModule

          if (!generatedFonts) {
            res.statusCode = 404
            return res.end()
          }

          const font = generatedFonts[fontType]

          res.setHeader('content-type', MIME_TYPES[fontType])
          res.setHeader('content-length', font.length)
          res.statusCode = 200

          return res.end(font)
        })
      }
    },
    buildEnd() {
      ac.abort()
      rmDir(TMP_DIR)
    },
  }
}
export default viteSvgToWebfont
export { type GeneratedWebfont, type PublicApi }

/**
 * Paths of default templates available for use.
 */
export const templates: webfontGenerator.Templates = webfontGenerator.templates
