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
  refreshToken?: RefreshToken;
}

export class SigninResDto extends SignupResDto {}
