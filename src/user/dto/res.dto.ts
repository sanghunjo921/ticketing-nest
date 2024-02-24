import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}

export class UsersResDto {
  @ApiPropertyOptional()
  users?: UserResDto[];
}
