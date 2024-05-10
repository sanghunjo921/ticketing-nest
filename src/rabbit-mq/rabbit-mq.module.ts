import { Module } from '@nestjs/common';
import rabbitmqConfig from 'src/config/rabbitmq.config';
import { RabbitMqService } from './rabbit-mq.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: RabbitMqService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new RabbitMqService(
          configService.get('rabbitmq.url'),
          configService.get('rabbitmq.queue'),
        );
      },
    },
  ],
  exports: [RabbitMqService],
  imports: [ConfigModule],
})
export class RabbitMqModule {}
