import { expect } from '@japa/expect'
import { specReporter } from '@japa/spec-reporter'
import { runFailedTests } from '@japa/run-failed-tests'
import { processCliArgs, configure, run } from '@japa/runner'
import { join } from 'path'
import sourceMapSupport from 'source-map-support'
import execa from 'execa'
import getPort from 'get-port'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: false })

async function refreshDatabase() {
  await execa.node('ace', ['migration:fresh'], {
    stdio: 'inherit',
  })
}

async function httpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  return new Ignitor(__dirname).httpServer()
}

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    suites: [
      {
        name: 'integration',
        files: ['tests/integrations/**/*.spec.ts'],
        async configure(suite) {
          const server = await httpServer()

          suite.setup(async () => {
            await refreshDatabase()
            await server.start()
          })

          suite.teardown(async () => {
            await server.close()
          })
        },
      },
      {
        name: 'unit',
        files: ['tests/units/**/*.spec.ts'],
      },
    ],
    plugins: [expect(), runFailedTests()],
    reporters: [specReporter()],
    importer: (filePath) => import(filePath),
  },
})

/*
|--------------------------------------------------------------------------
| Run tests
|--------------------------------------------------------------------------
|
| The following "run" method is required to execute all the tests.
|
*/
run()
