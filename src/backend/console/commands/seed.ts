/* eslint-disable */

import * as glob from 'glob'
import * as path from 'path'

import { ConnectionOptions, runSeeder, setConnection } from 'typeorm-seeding'

import { SeederConstructor } from 'typeorm-seeding/dist/types'
import chalk from 'chalk'
import { createConnection } from 'typeorm'
import { getDatabaseConfig } from '../../config'
import ora from 'ora'

process.env.TYPEORM_SYNCHRONIZE = 'true'

export const importFiles: any = (filePaths: string[]) =>
  filePaths.forEach(require)

export const loadFiles: any = (filePattern: string[]): string[] => {
  return filePattern
    .map((pattern: any) => glob.sync(path.join(process.cwd(), pattern)))
    .reduce((acc: any, filePath: any) => acc.concat(filePath), [])
}

export const importSeed: any = (filePath: string) => {
  const seedFileObject: any = require(filePath)
  const keys: any = Object.keys(seedFileObject)
  return seedFileObject[keys[0]]
}

// @ts-ignore
export async function seed({ input, flags }): any {
  const log = console.log
  const spinner: any = ora('Loading ormconfig').start()
  log('Start seeding...')
  function panic(spinner: ora.Ora, error: Error, message: string): void {
    spinner.fail(message)
    console.error(error)
    process.exit(1)
  }
  const databaseConfig: any = await getDatabaseConfig()
  spinner.succeed('Database config loaded')
  // try {
  //   options = await getDatabaseConfig();

  // } catch (error) {
  //   panic(spinner, error, 'Could not load the database config file!');
  // }

  // Find all factories and seed with help of the config
  spinner.start('Import Factories', input)
  const factoryFiles: any = loadFiles(
    input.factories || [
      process.env.SEEDER_FACTORIES || 'src/backend/**/*.factory.{js,ts}',
    ]
  )
  try {
    importFiles(factoryFiles)
    spinner.succeed('Factories are imported')
  } catch (error) {
    panic(spinner, error, 'Could not import factories!')
  }

  // Show seeds in the console
  spinner.start('Importing Seeders')

  const seedFiles: any = loadFiles(
    input.seeds || [process.env.SEEDER_SEEDS || 'src/backend/**/*.seed.{js,ts}']
  )
  log('seedFiles', seedFiles)
  const seedFileObjects: any = seedFiles
    .map((seedFile: any) => importSeed(seedFile))
    .filter(
      (seedFileObject: any) =>
        flags.run === undefined || flags.run === seedFileObject.name
    )
  log('seedFileObjects', seedFileObjects)
  spinner.succeed('Seeders are imported')

  // Get database connection and pass it to the seeder
  spinner.start('Connecting to the database')
  try {
    const connection: any = await createConnection(databaseConfig)
    setConnection(connection)
    spinner.succeed('Database connected')
  } catch (error) {
    panic(
      spinner,
      error,
      'Database connection failed! Check your typeORM config file.'
    )
  }

  // Run seeds
  for (const seedFileObject of seedFileObjects) {
    spinner.start(`Executing ${seedFileObject.name} Seeder`)
    try {
      await runSeeder(seedFileObject)
      spinner.succeed(`Seeder ${seedFileObject.name} executed`)
    } catch (error) {
      panic(spinner, error, `Could not run the seed ${seedFileObject.name}!`)
    }
  }

  log('👍 ', chalk.gray.underline(`Finished Seeding`))
  process.exit(0)
}
