import { User } from '../../src/entities/user'
import { Book } from '../../src/entities/book'
import { getConnectionOptions, createConnection } from 'typeorm'

// TODO: Refactor initDb
async function initDb() {
  const defaultConnectionOptions = await getConnectionOptions()

  const db = await createConnection({
    ...defaultConnectionOptions,
    entities: [User, Book],
  })

  return {
    stop: async () => {
      await db.close()
    },
  }
}

it('creates & retrieves books', async () => {
  const { stop } = await initDb()

  const book = Book.create({ name: 'Foo' })
  await book.save()

  expect(book.id).toBeDefined()

  await stop()
})

it('belongs to owner (user)', async () => {
  const { stop } = await initDb()

  const user = User.create({ firstName: 'John', lastName: 'Doe' })
  await user.save()

  const book = Book.create({
    owner: user,
    name: 'Harry Potter',
  })
  await book.save()

  expect(book.owner.id).toBe(user.id)
  expect(book.owner.firstName).toBe(user.firstName)

  await stop()
})
