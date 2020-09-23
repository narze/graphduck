import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'
import { Book } from './book'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number

  @Field()
  @Column()
  firstName: string

  @Field()
  @Column()
  lastName: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  age?: number

  @OneToMany(() => Book, (book) => book.owner)
  books: Book[]
}
