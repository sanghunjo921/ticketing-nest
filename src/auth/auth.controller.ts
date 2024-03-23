import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiPostResponse } from 'src/common/decorator/doc-res.decorator';
import { AuthService } from './auth.service';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { SigninResDto, SignupResDto } from './dto/res.dto';

@Controller()
@ApiExtraModels(SignupResDto, SigninResDto)
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPostResponse(SignupResDto, 'User signed up successfully')
  @Post('signup')
  async signup(
    @Body() { email, password, passwordConfirm }: SignupReqDto,
  ): Promise<SignupResDto> {
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }
    return this.authService.signUp(email, password);
  }

  @ApiPostResponse(SigninResDto, 'User signed in successfully')
  @Post('signin')
  async signin(
    @Body() { email, password }: SigninReqDto,
  ): Promise<SigninResDto> {
    return this.authService.signIn(email, password);
  }
}
