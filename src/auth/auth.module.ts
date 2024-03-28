import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth.guard.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'secretkey',
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AuthModule {}
