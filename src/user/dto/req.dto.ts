import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseOutput } from 'src/common/entities/base.dto';
import { User } from '../entity/user.entity';
import { Membership, Role } from '../type/user.enum';

export class FindUserReqDto {
  @ApiProperty({
    required: true,
  })
  @IsUUID()
  id: string;
}

export class CreateUserReqDto {
  @ApiProperty({
    required: true,
    example: 'test@test.com',
  })
  @MaxLength(20)
  @IsEmail()
  email: string;
  @ApiProperty({
    required: true,
    example: 'Passw0rd!',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,10}$/)
  password: string;
}

export class UpdateUserReqDto {
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @ApiPropertyOptional()
  role?: Role;

  @IsOptional()
  @ApiPropertyOptional()
  membership?: Membership;
}

export class DeleteUserReqDto {
  @ApiProperty({
    required: true,
  })
  @IsUUID()
  id: string;
}

export class ReserveTicketReqDto {
  @ApiProperty({
    required: true,
  })
  ticketId: number;

  @ApiPropertyOptional()
  @IsOptional()
  quantity: number = 1;
}

export class PurchaseTicketReqDto {
  @ApiProperty({
    required: true,
  })
  ticketId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  couponId: number;
}

export class IssueCouponReqDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  couponId: number;
}

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {
  @Field(() => String)
  confirmPassword: string;
}

@ObjectType()
export class CreateAccountOutput extends BaseOutput {}

@InputType()
export class SigninInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class SigninOutput extends BaseOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
