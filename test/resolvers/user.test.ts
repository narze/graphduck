import { createTestClient } from 'apollo-server-testing'
import { ApolloServer, gql } from 'apollo-server'
import { User } from '../../src/entities/user'
import { Book } from '../../src/entities/book'
import { getConnectionOptions, createConnection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import { UserResolver } from '../../src/resolvers/user'

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

it('fetches single launch', async () => {
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
    variables: { id: +mutateRes.data.createUser.id },
  })

  if (!getUserRes.data) {
    console.error(getUserRes)
    throw new Error('query error')
  }

  await stop()
})
