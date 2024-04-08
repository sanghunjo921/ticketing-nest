import { Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitMqService {
  private readonly logger = new Logger(RabbitMqService.name);
  private client: ClientProxy;

  constructor(
    private readonly url: string,
    private readonly queue: string,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.url],
        queue: this.queue,
      },
    });
  }

  async sendToRabbitMQ(
    userId: string,
    ticketId: number,
    quantity: number,
    totalPrice: number,
  ) {
    console.log({ userId });
    const data = {
      userId,
      ticketId,
      quantity,
      totalPrice,
    };
    try {
      await firstValueFrom(this.client.emit('completedTransaction', data));
      this.logger.log(`Sent ${JSON.stringify(data)} to RabbitMQ`);
    } catch (error) {
      this.logger.error('Error sending data to RabbitMQ:', error);
    }
  }
}
