import { Field, ObjectType } from '@nestjs/graphql';
import { Status } from '../../ticket/type/ticket.enum';

@ObjectType()
export class PopularTicket {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  status: Status;

  @Field(() => Number)
  price: number;

  @Field(() => Number)
  remaining_number: number;

  @Field(() => String)
  imagePath?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
