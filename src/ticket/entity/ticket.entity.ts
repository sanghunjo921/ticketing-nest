import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category, Status } from '../type/ticket.enum';
import { IsString, IsNumber, IsEnum } from 'class-validator';
import { Comment } from 'src/comment/entities/comment.entity';

registerEnumType(Status, { name: 'Status' });
registerEnumType(Category, { name: 'Category' });

@InputType({
  isAbstract: true,
})
@ObjectType()
@Entity()
export class Ticket extends BaseEntity {
  @Column({
    unique: true,
  })
  @Field(() => String)
  @IsString()
  title: string;

  @Column()
  @Field(() => String)
  description: string = 'No description yet';

  @Column({ type: 'enum', enum: Status })
  @Field(() => Status)
  @IsEnum(Status)
  status: Status = Status.AVAILABLE;

  @Column()
  @IsNumber()
  @Field(() => Number)
  price: number;

  @Column()
  @Field(() => Number)
  @IsNumber()
  remaining_number: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  imagePath?: string;

  @Column({ type: 'enum', enum: Category, nullable: true })
  @Field(() => Category, { nullable: true })
  @IsEnum(Category)
  category?: Category;

  @ManyToMany(() => User, (user) => user.tickets)
  @JoinTable()
  users: User[];

  @OneToMany(() => Comment, (comment) => comment.ticket, { eager: true })
  comments: Comment[];
}
