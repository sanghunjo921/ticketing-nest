import { Field, InputType } from '@nestjs/graphql';
import { Status } from 'src/ticket/type/ticket.enum';

//ArgType()
@InputType()
export class UpdatePopularTicketDto {
  @Field(() => Number, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  status?: Status;

  @Field(() => Number, { nullable: true })
  price?: number;

  @Field(() => Number, { nullable: true })
  remaining_number?: number;

  @Field(() => String, { nullable: true })
  imagePath?: string;

  @Field(() => Date, { defaultValue: new Date() })
  updatedAt?: Date;
}
