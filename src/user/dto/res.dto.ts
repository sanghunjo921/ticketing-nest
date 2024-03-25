import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Membership, Role } from '../type/user.enum';

class CommonResDto {
  @ApiProperty({
    required: true,
  })
  id: string;
}

export class UserResDto extends CommonResDto {
  @ApiProperty({
    required: true,
  })
  email: string;

  @ApiProperty({
    required: true,
  })
  password: string;
}

export class UsersResDto {
  @ApiPropertyOptional()
  users?: UserResDto[];
}

export class CreateUserResDto extends CommonResDto {}

export class UpdateUserResDto extends CommonResDto {}

export class DeleteUserResDto {}
