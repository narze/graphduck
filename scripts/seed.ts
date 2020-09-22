import 'reflect-metadata'

import { createConnection } from 'typeorm'
import { User } from '../src/entities/User'

const seed = async () => {
  const connection = await createConnection()
  await connection.dropDatabase()
  await connection.synchronize(true)

  await loadFixtures()
}

const loadFixtures = async () => {
  const users = [
    {
      firstName: 'John',
      lastName: 'Doe',
      age: 20,
    },
    {
      firstName: 'Mary',
      lastName: 'Jay',
      age: 18,
    },
  ]

  await Promise.all(
    users.map(async ({ firstName, lastName, age }) => {
      await User.create({ firstName, lastName, age }).save()

      // eslint-disable-next-line no-console
      console.info(`Created user ${firstName} ${lastName} with age ${age}`)
    })
  )
}

seed()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
