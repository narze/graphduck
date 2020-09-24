import { Author } from '@/entities/author'
import { Book } from '@/entities/book'
import { getConnectionOptions, createConnection } from 'typeorm'

// TODO: Refactor initDb
async function initDb() {
  const defaultConnectionOptions = await getConnectionOptions()

  const db = await createConnection({
    ...defaultConnectionOptions,
    entities: [Author, Book],
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

it('belongs to owner (author)', async () => {
  const { stop } = await initDb()

  const author = Author.create({ firstName: 'John', lastName: 'Doe' })
  await author.save()

  const book = Book.create({
    owner: author,
    name: 'Harry Potter',
  })
  await book.save()

  expect(book.owner.id).toBe(author.id)
  expect(book.owner.firstName).toBe(author.firstName)

  await stop()
})
