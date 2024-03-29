import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupResDto {
  @ApiPropertyOptional()
  id?: string;
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
