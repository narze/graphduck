/* istanbul ignore file */
const path = require('path')

const NODE_ENV = process.env.NODE_ENV || 'development'

const DEFAULTS = {
  type: 'postgres',
  entities: [path.join(__dirname, 'src/entities/**/*.ts')],
  migrations: [path.join(__dirname, 'src/migrations/**/*.ts')],
  subscribers: [path.join(__dirname, 'src/subscriber/**/*.ts')],
  synchronize: false,
  logging: false,
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
}

if (NODE_ENV === 'test') {
  module.exports = {
    ...DEFAULTS,
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
  }
}

if (NODE_ENV === 'development') {
  module.exports = {
    ...DEFAULTS,
    database: 'graphduck_dev',
  }
}
