import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth.guard.service';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './entity/refreshToken.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountRate } from 'src/discount-rate/entity/discountRate.entity';
import { GoogleStrategy } from './strategies/google.strategy';
import { User } from 'src/user/entity/user.entity';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { NaverStrategy } from './strategies/naver.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '10m' },
      }),
    }),
    TypeOrmModule.forFeature([RefreshToken, DiscountRate, User]),
  ],
  controllers: [AuthController],
  providers: [
    KakaoStrategy,
    NaverStrategy,
    GoogleStrategy,
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
