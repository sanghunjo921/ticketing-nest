import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SigninResDto, SignupResDto } from './dto/res.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refreshToken.entity';
import { DataSource, Repository } from 'typeorm';
import { ProviderType, TokenType } from './type/auth.type';
import { User } from 'src/user/entity/user.entity';
import { DiscountRate } from 'src/discount-rate/entity/discountRate.entity';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DiscountRate)
    private readonly discountRepository: Repository<DiscountRate>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}
  async signUp(
    email: string,
    password: string,
    res: Response,
    req: Request,
  ): Promise<SignupResDto> {
    const queryRunner = this.dataSource.createQueryRunner(); // 얘를 통해 디비에 접근 및 종료
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let error;

    try {
      const user = await this.userService.findOneByEmail(email);
      if (user) {
        throw new BadRequestException('User already exists');
      }
      const newUser = queryRunner.manager.create(User, { email, password });
      const discountRate = await this.discountRepository.findOne({
        where: {
          membershipLevel: 'bronze',
        },
      });
      newUser.discountRate = discountRate;
      await queryRunner.manager.save(newUser);

      const accessToken = this.generateToken(newUser.id, TokenType.ACCESS);
      const refreshToken = this.generateToken(newUser.id, TokenType.REFRESH);

      this.sendAuthCookies(res, accessToken, refreshToken, newUser.id);

      const refreshEntity = queryRunner.manager.create(RefreshToken, {
        token: refreshToken,
        user: { id: newUser.id },
      });

      await queryRunner.manager.save(refreshEntity);

      await queryRunner.commitTransaction();

      return {
        userId: newUser.id,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      error = err;
    } finally {
      await queryRunner.release();
      if (error) throw error;
    }
  }

  async signIn(
    email: string,
    password: string,
    res: Response,
  ): Promise<SigninResDto> {
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

    const accessToken = this.generateToken(user.id, TokenType.ACCESS);

    this.sendAuthCookies(res, accessToken, refreshToken.token, user.id);

    return {
      userId: user.id,
    };
  }

  async refresh(userId: string, token: string, res: Response) {
    const refresh = await this.refreshTokenRepository.findOneBy({ token });

    if (!refresh) {
      throw new BadRequestException('Invalid refresh Token');
    }

    const refreshToken = await this.createOrUpdateRefreshToken(
      userId,
      this.generateToken(userId, TokenType.REFRESH),
    );

    const accessToken = this.generateToken(userId, TokenType.ACCESS);

    this.sendAuthCookies(res, accessToken, refreshToken.token, userId);

    return {
      userId,
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
    let refreshToken = await this.refreshTokenRepository.findOneBy({
      user: { id: userId },
    });

    if (refreshToken) {
      refreshToken.token = token;
    } else {
      refreshToken = this.refreshTokenRepository.create({
        token,
        user: { id: userId },
      });
    }
    return this.refreshTokenRepository.save(refreshToken);
  }

  private sendAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    userId: string,
  ): void {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });

    res.cookie('userId', userId, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });
  }

  async findByEmailOrSave(email: string, provider: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (user) return user;

      const discountRate = await this.discountRepository.findOne({
        where: {
          membershipLevel: 'bronze',
        },
      });

      console.log({ newUser: 'create new user' });

      const newUser = this.userRepository.create({
        email,
        discountRate,
        provider,
      });

      console.log({ newUser, provider });

      await this.userRepository.save(newUser);

      return newUser;
    } catch (error) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
  }

  async googleLogin(
    req,
    res: Response,
    provider: string,
  ): Promise<SignupResDto> {
    const { email } = req.user;

    console.log({ provider });

    const user: User = await this.findByEmailOrSave(email, provider);
    const accessToken = this.generateToken(user.id, TokenType.ACCESS);
    const refreshToken = this.generateToken(user.id, TokenType.REFRESH);

    this.sendAuthCookies(res, accessToken, refreshToken, user.id);

    console.log({ accessToken: accessToken, refreshToken: refreshToken });

    return {
      userId: user.id,
    };
  }
}
