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
