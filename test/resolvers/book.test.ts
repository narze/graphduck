import { createTestClient } from 'apollo-server-testing'
import { ApolloServer, gql } from 'apollo-server'
import { Book } from '@/entities/book'
import { User } from '@/entities/user'
import { getConnectionOptions, createConnection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import { BookResolver } from '@/resolvers/book'

// TODO: Refactor server
async function getServer() {
  const defaultConnectionOptions = await getConnectionOptions()

  const db = await createConnection({
    ...defaultConnectionOptions,
    entities: [Book, User],
  })

  const schema = await buildSchema({
    resolvers: [BookResolver],
  })

  const server = new ApolloServer({ schema })
  return {
    server,
    stop: async () => {
      await server.stop()
      await db.close()
    },
  }
}

const GET_BOOKS = gql`
  query {
    books {
      name
    }
  }
`

const CREATE_BOOK = gql`
  mutation($name: String!) {
    createBook(name: $name) {
      name
    }
  }
`

it('creates new book record', async () => {
  const { server, stop } = await getServer()

  const { mutate, query } = createTestClient(server)

  const createBookRes = await mutate({
    mutation: CREATE_BOOK,
    variables: {
      name: 'Little Red Riding Hood',
    },
  })

  if (!createBookRes.data) {
    console.error(createBookRes)
    throw new Error('mutation error')
  }

  expect(createBookRes.data.createBook.name).toBe('Little Red Riding Hood')

  const getBooksRes = await query({ query: GET_BOOKS })

  if (!getBooksRes.data) {
    throw new Error('query error')
  }

  expect(getBooksRes.data.books).toBeInstanceOf(Array)
  expect(getBooksRes.data.books.length).toBe(1)

  await stop()
})
