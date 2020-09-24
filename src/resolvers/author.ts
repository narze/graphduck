import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Int,
  Root,
  FieldResolver,
} from 'type-graphql'
import { Author } from '@/entities/author'

@Resolver(() => Author)
export class AuthorResolver {
  @Query(() => [Author])
  authors(): Promise<Author[]> {
    return Author.find()
  }

  @Query(() => Author)
  async author(@Arg('id', () => Int) id: number): Promise<Author | undefined> {
    return await Author.findOne({ id })
  }

  @Mutation(() => Author)
  async createAuthor(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('age', { nullable: true }) age: number
  ): Promise<Author> {
    const author = Author.create({ firstName, lastName, age })
    return await author.save()
  }

  // FIXME: Maybe this cause n+1 queries issue
  @FieldResolver(() => Int)
  async booksCount(@Root() author: Author): Promise<number> {
    const books = await author.books
    return books.length
  }
}
