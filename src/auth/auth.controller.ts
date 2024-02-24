import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { SigninResDto, SignupResDto } from './dto/res.dto';

@Controller()
@ApiExtraModels(SignupResDto, SigninResDto)
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() { email, password, passwordConfirm }: SignupReqDto,
  ): Promise<SignupResDto> {
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }
    return this.authService.signUp(email, password);
  }

  @Post('signin')
  async signin(
    @Body() { email, password }: SigninReqDto,
  ): Promise<SigninResDto> {
    return this.authService.signIn(email, password);
  }
}
