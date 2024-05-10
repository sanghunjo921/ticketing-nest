import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
  Headers,
  Res,
  Req,
  UseGuards,
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
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

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
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignupResDto> {
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }
    return this.authService.signUp(email, password, res);
  }

  @Public()
  @ApiPostResponse(SigninResDto, 'User signed in successfully')
  @Post('signin')
  async signin(
    @Body() { email, password }: SigninReqDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SigninResDto> {
    return this.authService.signIn(email, password, res);
  }

  @ApiBearerAuth()
  @ApiGetResponse(RefreshResDto)
  @Get('refresh')
  async refresh(
    @Headers('authorization') authorization,
    @AuthUser() user: AuthUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = /Bearer\s(.+)/.exec(authorization)?.[1];
    return this.authService.refresh(user.id, token, res);
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('oauth2/redirect/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = await this.authService.googleLogin(req, res);
    res.redirect('/ticket');
  }
}
