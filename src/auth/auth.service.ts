import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { SigninResDto, SignupResDto } from './dto/res.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refreshToken.entity';
import { Repository } from 'typeorm';
import { TokenType } from './type/auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTorekenRepository: Repository<RefreshToken>,
  ) {}
  async signUp(email: string, password: string): Promise<SignupResDto> {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const newUser = await this.userService.create(email, password);

    const refreshToken = await this.createOrUpdateRefreshToken(
      newUser.id,
      this.generateToken(newUser.id, TokenType.REFRESH),
    );
    return {
      accessToken: this.generateToken(newUser.id, TokenType.ACCESS),
      refreshToken: refreshToken.token,
    };
  }

  async signIn(email: string, password: string): Promise<SigninResDto> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    if (password !== user.password) {
      throw new BadRequestException('Password does not match');
    }

    const refreshToken = await this.createOrUpdateRefreshToken(
      user.id,
      this.generateToken(user.id, TokenType.REFRESH),
    );

    return {
      accessToken: this.generateToken(user.id, TokenType.ACCESS),
      refreshToken: refreshToken.token,
    };
  }

  private generateToken(userId: string, tokenType: TokenType): string {
    const payload = {
      sub: userId,
      type: tokenType.toString(),
    };

    return tokenType === TokenType.REFRESH
      ? this.jwtService.sign(payload, { expiresIn: '30d' })
      : this.jwtService.sign(payload);
  }

  private async createOrUpdateRefreshToken(
    userId: string,
    token: string,
  ): Promise<RefreshToken> {
    let refreshToken = await this.refreshTorekenRepository.findOneBy({
      user: { id: userId },
    });

    if (refreshToken) {
      refreshToken.token = token;
    } else {
      refreshToken = this.refreshTorekenRepository.create({
        token,
        user: { id: userId },
      });
    }
    return this.refreshTorekenRepository.save(refreshToken);
  }
}
