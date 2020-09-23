import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { User } from './user'

@ObjectType()
@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Field()
  @Column()
  name: string

  @ManyToOne(() => User, (user) => user.books)
  owner: User
}
