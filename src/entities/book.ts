import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Field()
  @Column()
  name: string
}
