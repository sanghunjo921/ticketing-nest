import { Field, InputType } from '@nestjs/graphql';
import { Status } from 'src/ticket/type/ticket.enum';

//ArgType()
@InputType()
export class CreatePopularTicketDto {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String, { defaultValue: 'no desc yet' })
  description: string;

  @Field(() => String, { defaultValue: Status.AVAILABLE })
  status: Status;

  @Field(() => Number)
  price: number;

  @Field(() => Number)
  remaining_number: number;

  @Field(() => String)
  imagePath?: string;

  @Field(() => Date, { defaultValue: new Date() })
  createdAt: Date;

  @Field(() => Date, { defaultValue: new Date() })
  updatedAt: Date;
}
