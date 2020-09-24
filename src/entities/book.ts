import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { Author } from './author'

@ObjectType()
@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Field()
  @Column()
  name: string

  @ManyToOne(() => Author, (author) => author.books)
  owner: Author
}
