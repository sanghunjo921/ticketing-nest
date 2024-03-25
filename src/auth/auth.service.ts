import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { SigninResDto, SignupResDto } from './dto/res.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(email: string, password: string): Promise<SignupResDto> {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return this.userService.create(email, password);
  }

  async signIn(email: string, password: string): Promise<SigninResDto> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    if (password !== user.password) {
      throw new BadRequestException('Password does not match');
    }

    return {
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }
}
