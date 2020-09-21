import { Resolver, Query } from "type-graphql";
import { Entity } from "typeorm";
import { User } from "../entity/User";

@Resolver()
@Entity()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }
}
