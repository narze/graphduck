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
export class Author extends BaseEntity {
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

  // FIXME: Maybe this cause n+1 queries issue
  @Field(() => [Book])
  @OneToMany(() => Book, (book) => book.owner, { lazy: true })
  books: Promise<Book[]> | Book[]
}
