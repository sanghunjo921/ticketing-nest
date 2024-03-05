import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MaxLength } from 'class-validator';

class UserInfo {
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

export class SigninReqDto extends UserInfo {}

export class SignupReqDto extends SigninReqDto {
  @ApiProperty({
    required: true,
    example: 'Passw0rd!',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,10}$/)
  passwordConfirm: string;
}
