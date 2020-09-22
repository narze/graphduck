import { Resolver, Query, Mutation, Arg } from 'type-graphql'
import { Book } from '../entities/book'

@Resolver(() => Book)
export class BookResolver {
  @Query(() => [Book])
  books(): Promise<Book[]> {
    return Book.find()
  }

  @Mutation(() => Book)
  async createBook(@Arg('name') name: string): Promise<Book> {
    const record = Book.create({ name })
    return await record.save()
  }
}
