import { Module, NestModule, MiddlewareConsumer, Logger } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/postgres.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CouponModule } from './coupon/coupon.module';
import { DiscountRateModule } from './discount-rate/discount-rate.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import jwtConfig from './config/jwt.config';
import { LoggerContextMiddleware } from './common/middleware/logger.middleware';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let typeOrmModuleOptions: TypeOrmModuleOptions = {
          type: configService.get('db.type'),
          host: configService.get('db.host'),
          port: configService.get('db.port'),
          database: configService.get('db.dbName'),
          username: configService.get('db.username'),
          password: configService.get('db.password'),
          autoLoadEntities: true,
        } as any;
        if (configService.get('STAGE') === 'dev') {
          console.log(typeOrmModuleOptions);
          typeOrmModuleOptions = Object.assign(typeOrmModuleOptions, {
            synchronize: true,
            logging: true,
          });
        }
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
    RabbitMqModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
