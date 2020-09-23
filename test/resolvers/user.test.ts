import { createTestClient } from 'apollo-server-testing'
import { ApolloServer, gql } from 'apollo-server'
import { User } from '@/entities/user'
import { Book } from '@/entities/book'
import { getConnectionOptions, createConnection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import { UserResolver } from '@/resolvers/user'

// TODO: Refactor server
async function getServer() {
  const defaultConnectionOptions = await getConnectionOptions()

  const db = await createConnection({
    ...defaultConnectionOptions,
    entities: [User, Book],
  })

  const schema = await buildSchema({
    resolvers: [UserResolver],
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
    users {
      id
      age
      firstName
      lastName
    }
  }
`

const GET_USER_WITH_ID = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      age
      firstName
      lastName
    }
  }
`

const CREATE_USER = gql`
  mutation {
    createUser(firstName: "Foo", lastName: "Bar") {
      id
      age
      firstName
      lastName
    }
  }
`

const GET_USER_WITH_ID_WITH_BOOKS = gql`
  query($id: Int!) {
    user(id: $id) {
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

it('creates & retrieves users', async () => {
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

  expect(mutateRes.data.createUser.age).toBe(null)
  expect(mutateRes.data.createUser.firstName).toBe('Foo')
  expect(mutateRes.data.createUser.lastName).toBe('Bar')
  // expect(mutateRes.data).toMatchInlineSnapshot();

  const queryRes = await query({ query: GET_USERS })

  if (!queryRes.data) {
    throw new Error('query error')
  }

  expect(queryRes.data.users).toBeInstanceOf(Array)
  expect(queryRes.data.users.length).toBe(1)
  // expect(queryRes.data).toMatchInlineSnapshot();

  const getUserRes = await query({
    query: GET_USER_WITH_ID,
    variables: { id: +queryRes.data.users[0].id },
  })

  if (!getUserRes.data) {
    console.error(getUserRes)
    throw new Error('query error')
  }

  expect(getUserRes.data.user.id).toBe(queryRes.data.users[0].id)

  await stop()
})

it('can resolves user with books & booksCount', async () => {
  const { server, stop } = await getServer()

  const user = User.create({ firstName: 'John', lastName: 'Doe' })
  await user.save()

  const book = Book.create({
    owner: user,
    name: 'Harry Potter',
  })
  await book.save()

  const { query } = createTestClient(server)

  const queryRes = await query({
    query: GET_USER_WITH_ID_WITH_BOOKS,
    variables: { id: user.id },
  })

  if (!queryRes.data) {
    console.error(queryRes)
    throw new Error('query error')
  }

  expect(queryRes.data.user.books[0].name).toBe(book.name)
  expect(queryRes.data.user.booksCount).toBe(1)

  await stop()
})
