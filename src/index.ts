import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { createConnection, getConnectionOptions } from 'typeorm'
import { User } from '@/entities/user'
import { Book } from '@/entities/book'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from '@/resolvers/hello'
import { UserResolver } from '@/resolvers/user'
import { BookResolver } from '@/resolvers/book'

const main = async () => {
  const defaultConnectionOptions = await getConnectionOptions()

  // TODO: auto include all entities & resolvers
  const conn = await createConnection({
    ...defaultConnectionOptions,
    entities: [User, Book],
  })

  await conn.synchronize()

  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver, BookResolver],
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
