import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Int,
  Root,
  FieldResolver,
} from 'type-graphql'
import { User } from '@/entities/user'

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find()
  }

  @Query(() => User)
  async user(@Arg('id', () => Int) id: number): Promise<User | undefined> {
    return await User.findOne({ id })
  }

  @Mutation(() => User)
  async createUser(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('age', { nullable: true }) age: number
  ): Promise<User> {
    const user = User.create({ firstName, lastName, age })
    return await user.save()
  }

  // FIXME: Maybe this cause n+1 queries issue
  @FieldResolver(() => Int)
  async booksCount(@Root() user: User): Promise<number> {
    const books = await user.books
    return books.length
  }
}
