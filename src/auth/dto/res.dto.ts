import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupResDto {
  @ApiProperty({
    required: true,
  })
  id: string;
  @ApiPropertyOptional({
    required: true,
  })
  accessToken?: string;
  @ApiPropertyOptional({
    required: true,
  })
  refreshToken?: string;
}

export class SigninResDto extends SignupResDto {}
