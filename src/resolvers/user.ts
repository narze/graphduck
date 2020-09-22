import { Resolver, Query, Mutation, Arg, Int } from 'type-graphql'
import { User } from '../entities/user'

@Resolver()
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
}
