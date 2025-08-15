import fs from 'fs'
import path from 'path'
import { loadEnv } from 'vite'

let count = 0

function renamePrerenderedPages(
  dir,
  removeOriginalFolder = true
) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const folderName = entry.name
      const folderPath = path.join(dir, folderName)
      const indexHtmlPath = path.join(folderPath, 'index.html')

      if (fs.existsSync(indexHtmlPath)) {
        const newHtmlPath = path.join(dir, `${folderName}.html`)

        fs.renameSync(indexHtmlPath, newHtmlPath)
        console.log(`${indexHtmlPath} renamed to ${newHtmlPath}`)
        count++

        if (removeOriginalFolder) {
          fs.rmSync(folderPath, { recursive: true })
          console.log(`removed folder: ${folderPath}`)
        }
      } else {
        renamePrerenderedPages(folderPath)
      }
    }
  }
}

function renameAllPrerenderedPages() {
  const env = loadEnv('', process.cwd(), '')
  const basename = typeof env.USE_BASE_PUBLIC_PATH === 'string' ? env.USE_BASE_PUBLIC_PATH : '/'

  if (basename !== '/') {
    console.log(`renameAllPrerenderedPages: (not default value) using basename`, basename)
    console.log(`renameAllPrerenderedPages: renameAllPrerenderedPages() should be run after movePrerenderedPagesOneLevelUpperForGithubPagesOfProject()`)
  }

  // todo replace `build` by react-router config parameter
  const clientDir = path.join(process.cwd(), 'build', 'client')

  console.log(`Rename prerendered pages from <page-name/index.html> into <page-name.html>`)
  count = 0
  renamePrerenderedPages(clientDir)
  console.log(`${count} page${count > 1 ? 's' : ''} renamed`)
}

renameAllPrerenderedPages()
