import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { createConnection, getConnectionOptions } from 'typeorm'
import { Author } from '@/entities/author'
import { Book } from '@/entities/book'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from '@/resolvers/hello'
import { AuthorResolver } from '@/resolvers/author'
import { BookResolver } from '@/resolvers/book'

const main = async () => {
  const defaultConnectionOptions = await getConnectionOptions()

  // TODO: auto include all entities & resolvers
  const conn = await createConnection({
    ...defaultConnectionOptions,
    entities: [Author, Book],
  })

  await conn.synchronize()

  const schema = await buildSchema({
    resolvers: [HelloResolver, AuthorResolver, BookResolver],
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
