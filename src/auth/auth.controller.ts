import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
  Headers,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  AuthUser,
  AuthUserType,
} from 'src/common/decorator/auth-user.decorator';
import {
  ApiGetResponse,
  ApiPostResponse,
} from 'src/common/decorator/doc-res.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { AuthService } from './auth.service';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { RefreshResDto, SigninResDto, SignupResDto } from './dto/res.dto';

@Controller()
@ApiExtraModels(SignupResDto, SigninResDto, RefreshResDto)
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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

  @Public()
  @ApiPostResponse(SigninResDto, 'User signed in successfully')
  @Post('signin')
  async signin(
    @Body() { email, password }: SigninReqDto,
  ): Promise<SigninResDto> {
    return this.authService.signIn(email, password);
  }

  @ApiBearerAuth()
  @ApiGetResponse(RefreshResDto)
  @Get('refresh')
  async refresh(
    @Headers('authorization') authorization,
    @AuthUser() user: AuthUserType,
  ) {
    const token = /Bearer\s(.+)/.exec(authorization)?.[1];
    return this.authService.refresh(user.id, token);
  }
}
