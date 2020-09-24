import 'reflect-metadata'

import { createConnection } from 'typeorm'
import { Author } from '@/entities/author'

const seed = async () => {
  const connection = await createConnection()
  await connection.dropDatabase()
  await connection.runMigrations()

  await loadFixtures()
}

const loadFixtures = async () => {
  const authors = [
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
    authors.map(async ({ firstName, lastName, age }) => {
      await Author.create({ firstName, lastName, age }).save()

      // eslint-disable-next-line no-console
      console.info(`Created author ${firstName} ${lastName} with age ${age}`)
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
