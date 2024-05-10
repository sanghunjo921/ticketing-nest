import { Module, NestModule, MiddlewareConsumer, Logger } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from './config/postgres.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CouponModule } from './coupon/coupon.module';
import { DiscountRateModule } from './discount-rate/discount-rate.module';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import jwtConfig from './config/jwt.config';
import { LoggerContextMiddleware } from './common/middleware/logger.middleware';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
import awsConfig from './config/aws.config';
import { AwsModule } from './aws/aws.module';
import redisConfig from './config/redis.config';
import rabbitmqConfig from './config/rabbitmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
      load: [dbConfig, jwtConfig, awsConfig, redisConfig, rabbitmqConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
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
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        let redisModuleOptions: RedisModuleOptions = {
          config: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
          },
        };

        return redisModuleOptions;
      },
    }),
    AuthModule,
    UserModule,
    TicketModule,
    CouponModule,
    DiscountRateModule,
    RabbitMqModule,
    AwsModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
