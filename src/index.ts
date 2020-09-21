import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { createConnection, getConnectionOptions } from 'typeorm'
import { User } from './entity/User'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/User'

const main = async () => {
  const defaultConnectionOptions = await getConnectionOptions()

  const conn = await createConnection({
    ...defaultConnectionOptions,
    entities: [User],
  })

  await conn.synchronize()

  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver],
  })

  const server = new ApolloServer({ schema })

  // The `listen` method launches a web server.
  server.listen().then(({ url }: { url: string }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀  Server ready at ${url}`)
  })
}

main().catch((err) => {
  console.error(err)
})
