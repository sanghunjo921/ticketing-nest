import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';

import { Repository } from 'typeorm';

import { Transaction } from './entity/transaction.entity';
import { Ticket } from './entity/ticket.entity';

import * as cron from 'node-cron';

@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRedis()
    private readonly redisService: Redis,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  batchInterval: string = '* * * * *';

  processBatchedRequests = async (batchedRequests, batchSize, ticketMap) => {
    console.log({ batchedRequests }, batchedRequests.length);

    try {
      const transactionsToCreate: Transaction[] = batchedRequests.splice(
        0,
        batchSize,
      );

      const bulkInsertData = transactionsToCreate.map((data) => {
        return { ...data };
      });

      console.log({ bulkInsertData });

      const query = this.transactionRepository
        .createQueryBuilder()
        .insert()
        .into(Transaction)
        .values(bulkInsertData);
      await query.execute();

      //   const createdTransactions: Transaction[] = await Promise.all(
      //     transactionsToCreate.map((data: Transaction) =>
      //       this.transactionRepository.create(data),
      //     ),
      //   );
      //   await Promise.all(
      //     createdTransactions.map((transaction: Transaction) =>
      //       this.transactionRepository.save(transaction),
      //     ),
      //   );

      await this.redisService.ltrim('transaction', batchSize, -1);

      for (const [ticketId, value] of ticketMap.entries()) {
        await this.ticketRepository.update(ticketId, {
          remaining_number: () => `remaining_number - ${value}`,
        });
      }

      console.log('Batch processing completed.');
      console.log(`after Batched requests count: ${batchedRequests.length}`);
    } catch (error) {
      throw new Error('Error processing batched requests');
    }
  };

  initiateCron = async () => {
    cron.schedule(this.batchInterval, async () => {
      try {
        console.log('started cron');
        const transactionDataKey: string = 'transaction';
        const batchedRequests = await this.redisService.lrange(
          transactionDataKey,
          0,
          -1,
        );

        const requests: Transaction[] = batchedRequests.map((item) =>
          JSON.parse(item),
        );

        const currentTime: number = Date.now();
        const timeLimit: number = 2 * 60 * 1000;
        let batchSize: number = 0;
        const ticketMap: Map<number, number> = new Map<number, number>();

        // console.log(typeof requests[0].ticketId);
        // console.log(currentTime - requests[0].startTime > timeLimit);

        requests.forEach((item) => {
          console.log(typeof item.ticketId);

          if (currentTime - item.startTime > timeLimit) {
            batchSize += 1;

            if (ticketMap.has(item.ticketId)) {
              ticketMap.set(
                item.ticketId,
                ticketMap.get(item.ticketId) + item.quantity,
              );
            } else {
              ticketMap.set(item.ticketId, item.quantity);
            }
          }
        });

        // console.log(requests, batchSize, ticketMap);

        if (batchSize >= 1) {
          await this.processBatchedRequests(requests, batchSize, ticketMap);
        }
      } catch (error) {
        throw new Error('Error during cron execution');
      }
    });
  };
}
