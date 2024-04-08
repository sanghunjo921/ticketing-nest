import { Module } from '@nestjs/common';
import rabbitmqConfig from 'src/config/rabbitmq.config';
import { RabbitMqService } from './rabbit-mq.service';

@Module({
  providers: [
    {
      provide: RabbitMqService,
      useFactory: () => {
        return new RabbitMqService(rabbitmqConfig.url, rabbitmqConfig.queue);
      },
    },
  ],
  exports: [RabbitMqService],
})
export class RabbitMqModule {}
