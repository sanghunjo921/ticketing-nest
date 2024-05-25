import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import { Status } from 'src/ticket/type/ticket.enum';

//ArgsType()
@InputType()
export class CreatePopularTicketInput extends PickType(Ticket, [
  'title',
  'price',
  'remaining_number',
  'description',
  'status',
  'category',
]) {}

@ObjectType()
export class CreatePopularTicketOutput {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => Boolean)
  ok: boolean;
}
