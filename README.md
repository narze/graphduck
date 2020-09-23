# Graphduck

[![codecov](https://codecov.io/gh/narze/graphduck/branch/main/graph/badge.svg)](https://codecov.io/gh/narze/graphduck)

GraphQL server stack made with Apollo Server 2, TypeORM, TypeGraphQL, and more.

## Setup

- Install Node.js (v12 / v14)
- Create Postgres Database with name `graphduck_dev`

```shell
psql -h localhost -U postgres -c 'CREATE DATABASE graphduck_dev;'
# or using Docker
docker run -it --rm postgres:alpine psql -h host.docker.internal -U postgres -c 'CREATE DATABASE graphduck_dev;'
```

- `yarn install`
- `yarn db:migrate`
- `yarn dev`

## Development flow

### Adding new Entity

1. Create new Entity in `src/entities`

```shell
touch src/entities/your_entity.ts
```

1. Create & export entity class

- Use TypeORM decorators to define column eg. `@Column`, `@PrimaryGeneratedColumn`
- Use TypeGraphQL decorators to define field eg. `@Field`

1. Generate database migration file from TypeORM entities

```shell
yarn migration:generate -n YourMigrationName
```

1. Check your generated migration file, then apply the migration

```shell
yarn db:migrate
```

### Adding new Resolver

1. Create new resolver, with test file

   ```shell
   export NAME=your_resolver && touch src/resolvers/${NAME}.ts src/resolvers/__tests__/${NAME}.test.ts
   ```

1. Create your intended query / mutation in test file, then run test once

```shell
yarn test # or yarn test --watch
```

1. Implement the query / mutation, until the test passes, then refactor
