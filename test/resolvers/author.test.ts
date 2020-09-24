import { createTestClient } from 'apollo-server-testing'
import { ApolloServer, gql } from 'apollo-server'
import { Author } from '@/entities/author'
import { Book } from '@/entities/book'
import { getConnectionOptions, createConnection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import { AuthorResolver } from '@/resolvers/author'

// TODO: Refactor server
async function getServer() {
  const defaultConnectionOptions = await getConnectionOptions()

  const db = await createConnection({
    ...defaultConnectionOptions,
    entities: [Author, Book],
  })

  const schema = await buildSchema({
    resolvers: [AuthorResolver],
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

const GET_USERS = gql`
  query {
    authors {
      id
      age
      firstName
      lastName
    }
  }
`

const GET_USER_WITH_ID = gql`
  query($id: Int!) {
    author(id: $id) {
      id
      age
      firstName
      lastName
    }
  }
`

const CREATE_USER = gql`
  mutation {
    createAuthor(firstName: "Foo", lastName: "Bar") {
      id
      age
      firstName
      lastName
    }
  }
`

const GET_USER_WITH_ID_WITH_BOOKS = gql`
  query($id: Int!) {
    author(id: $id) {
      id
      age
      firstName
      lastName
      books {
        name
      }
      booksCount
    }
  }
`

it('creates & retrieves authors', async () => {
  const { server, stop } = await getServer()

  const { mutate, query } = createTestClient(server)

  const mutateRes = await mutate({
    mutation: CREATE_USER,
    variables: {},
  })

  if (!mutateRes.data) {
    console.error(mutateRes)
    throw new Error('mutation error')
  }

  expect(mutateRes.data.createAuthor.age).toBe(null)
  expect(mutateRes.data.createAuthor.firstName).toBe('Foo')
  expect(mutateRes.data.createAuthor.lastName).toBe('Bar')
  // expect(mutateRes.data).toMatchInlineSnapshot();

  const queryRes = await query({ query: GET_USERS })

  if (!queryRes.data) {
    throw new Error('query error')
  }

  expect(queryRes.data.authors).toBeInstanceOf(Array)
  expect(queryRes.data.authors.length).toBe(1)
  // expect(queryRes.data).toMatchInlineSnapshot();

  const getAuthorRes = await query({
    query: GET_USER_WITH_ID,
    variables: { id: +queryRes.data.authors[0].id },
  })

  if (!getAuthorRes.data) {
    console.error(getAuthorRes)
    throw new Error('query error')
  }

  expect(getAuthorRes.data.author.id).toBe(queryRes.data.authors[0].id)

  await stop()
})

it('can resolves author with books & booksCount', async () => {
  const { server, stop } = await getServer()

  const author = Author.create({ firstName: 'John', lastName: 'Doe' })
  await author.save()

  const book = Book.create({
    owner: author,
    name: 'Harry Potter',
  })
  await book.save()

  const { query } = createTestClient(server)

  const queryRes = await query({
    query: GET_USER_WITH_ID_WITH_BOOKS,
    variables: { id: author.id },
  })

  if (!queryRes.data) {
    console.error(queryRes)
    throw new Error('query error')
  }

  expect(queryRes.data.author.books[0].name).toBe(book.name)
  expect(queryRes.data.author.booksCount).toBe(1)

  await stop()
})
