import "reflect-metadata";
const { ApolloServer, gql } = require("apollo-server");
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  const conn = await createConnection();
  await conn.runMigrations();

  const schema = await buildSchema({
    resolvers: [HelloResolver],
  });

  const server = new ApolloServer({ schema });

  // The `listen` method launches a web server.
  server.listen().then(({ url }: { url: string }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

main().catch((err) => {
  console.error(err);
});
