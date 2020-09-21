import { Resolver, Query, Mutation, Arg } from 'type-graphql'
import { Entity } from 'typeorm'
import { User } from '../entity/User'

@Resolver()
@Entity()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find()
  }

  @Mutation(() => User)
  async createUser(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('age') age: number
  ) {
    const user = User.create({ firstName, lastName, age })
    return await user.save()
  }
}
