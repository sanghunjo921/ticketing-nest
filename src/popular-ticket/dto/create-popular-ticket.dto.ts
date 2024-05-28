import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { BaseOutput } from 'src/common/entities/base.dto';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import { Category, Status } from 'src/ticket/type/ticket.enum';

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
export class CreatePopularTicketOutput extends BaseOutput {}

@InputType()
export class GetPopularTicketInput extends PartialType(
  PickType(Ticket, ['category']),
) {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}

@ObjectType()
export class GetPopularTicketOutput {
  @Field(() => String, { nullable: true })
  error?: string;
  @Field(() => Boolean)
  ok: boolean;
  @Field(() => [Ticket], { nullable: true })
  sportsTicket?: Ticket[];
  @Field(() => [Ticket], { nullable: true })
  moviesTicket?: Ticket[];
  @Field(() => [Ticket], { nullable: true })
  concertsTicket?: Ticket[];
}
