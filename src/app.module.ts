import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/postgres.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CouponModule } from './coupon/coupon.module';
import { DiscountRateModule } from './discount-rate/discount-rate.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';

// 관리용 module by domain
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const typeOrmModuleOptions: TypeOrmModuleOptions = {
          type: configService.get('db.type'),
          host: configService.get('db.host'),
          port: configService.get('db.port'),
          database: configService.get('db.dbName'),
          username: configService.get('db.username'),
          password: configService.get('db.password'),
          synchronize: true,
          autoLoadEntities: true,
        } as any;
        console.log(typeOrmModuleOptions);
        return typeOrmModuleOptions;
      },
    }),
    RedisModule.forRoot({
      config: {
        host: 'redis',
        port: 6379,
      },
    }),
    AuthModule,
    UserModule,
    TicketModule,
    CouponModule,
    DiscountRateModule,
  ],
})
export class AppModule {}
