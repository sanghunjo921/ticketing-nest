import { Redis } from 'ioredis';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';
import { Ticket } from './entity/ticket.entity';
export declare class BatchService {
    private readonly transactionRepository;
    private readonly redisService;
    private readonly ticketRepository;
    constructor(transactionRepository: Repository<Transaction>, redisService: Redis, ticketRepository: Repository<Ticket>);
    batchInterval: string;
    processBatchedRequests: (batchedRequests: any, batchSize: any, ticketMap: any) => Promise<void>;
    initiateCron: () => Promise<void>;
}
