import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { Field, ID, ObjectType } from 'type-graphql'

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
}
