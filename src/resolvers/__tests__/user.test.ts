import { createTestClient } from 'apollo-server-testing'
import { ApolloServer, gql } from 'apollo-server'
import { User } from '../../entities/User'
import { getConnectionOptions, createConnection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import { UserResolver } from '../User'

// TODO: Refactor server
async function getServer() {
  const defaultConnectionOptions = await getConnectionOptions()

  const db = await createConnection({
    ...defaultConnectionOptions,
    entities: [User],
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

const CREATE_USER = gql`
  mutation {
    createUser(age: 20, firstName: "Foo", lastName: "Bar") {
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

  expect(mutateRes.data.createUser.age).toBe(20)
  expect(mutateRes.data.createUser.firstName).toBe('Foo')
  expect(mutateRes.data.createUser.lastName).toBe('Bar')
  // expect(mutateRes.data).toMatchInlineSnapshot();

  const queryRes = await query({ query: GET_USERS })

  if (!queryRes.data) {
    throw new Error('mutation error')
  }

  expect(queryRes.data.users).toBeInstanceOf(Array)
  expect(queryRes.data.users.length).toBe(1)
  // expect(queryRes.data).toMatchInlineSnapshot();

  await stop()
})
