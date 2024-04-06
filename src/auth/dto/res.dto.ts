import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RefreshToken } from '../entity/refreshToken.entity';

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

export class RefreshResDto extends SignupResDto {}
