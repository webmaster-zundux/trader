import fs from 'fs'
import path from 'path'
import { loadEnv } from 'vite'

function movePrerenderedPagesOneLevelUpperForGithubPagesOfProject() {
  const env = loadEnv('', process.cwd(), '')
  const basename = typeof env.USE_BASE_PUBLIC_PATH === 'string' ? env.USE_BASE_PUBLIC_PATH : '/'

  if (basename !== '/') {
    console.log(`movePrerenderedPagesOneLevelUpperForGithubPagesOfProject: using basename ${basename}`)
  } else {
    console.log(`basename has default value "/". Lift up is not needed`)
    return
  }

  // todo replace `build` by react-router config parameter
  const clientDirWithBaseName = path.join(process.cwd(), 'build', 'client', basename)
  const clientDir = path.join(process.cwd(), 'build', 'client')

  fs.cpSync(clientDirWithBaseName, clientDir, { recursive: true })
  fs.rmSync(clientDirWithBaseName, { recursive: true })
}

movePrerenderedPagesOneLevelUpperForGithubPagesOfProject()
