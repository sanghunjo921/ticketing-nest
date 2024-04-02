"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchService = void 0;
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ioredis_1 = require("ioredis");
const typeorm_2 = require("typeorm");
const node_cron_1 = require("node-cron");
const transaction_entity_1 = require("./entity/transaction.entity");
const ticket_entity_1 = require("./entity/ticket.entity");
let BatchService = class BatchService {
    constructor(transactionRepository, redisService, ticketRepository) {
        this.transactionRepository = transactionRepository;
        this.redisService = redisService;
        this.ticketRepository = ticketRepository;
        this.batchInterval = '* * * * *';
        this.processBatchedRequests = async (batchedRequests, batchSize, ticketMap) => {
            console.log({ batchedRequests }, batchedRequests.length);
            try {
                const transactionsToCreate = batchedRequests.splice(0, batchSize);
                const createdTransactions = await Promise.all(transactionsToCreate.map((data) => this.transactionRepository.create(data)));
                await Promise.all(createdTransactions.map((transaction) => this.transactionRepository.save(transaction)));
                await this.redisService.set('transaction', JSON.stringify(batchedRequests));
                for (const [ticketId, value] of ticketMap.entries()) {
                    await this.ticketRepository.update(ticketId, {
                        remaining_number: () => `remaining_number - ${value}`,
                    });
                }
                console.log('Batch processing completed.');
                console.log(`after Batched requests count: ${batchedRequests.length}`);
            }
            catch (error) {
                throw new Error('Error processing batched requests');
            }
        };
        this.initiateCron = async () => {
            node_cron_1.default.schedule(this.batchInterval, async () => {
                try {
                    console.log('started cron');
                    const transactionDataKey = 'transaction';
                    const batchedRequests = JSON.parse(await this.redisService.get(transactionDataKey));
                    const currentTime = Date.now();
                    const timeLimit = 10 * 60 * 1000;
                    let batchSize = 0;
                    let ticketMap = new Map();
                    batchedRequests.forEach((item) => {
                        console.log(typeof item.ticketId);
                        if (currentTime - item.startTime > timeLimit) {
                            batchSize += 1;
                            if (ticketMap.has(item.ticketId)) {
                                ticketMap.set(item.ticketId, ticketMap.get(item.ticketId) + item.quantity);
                            }
                            else {
                                ticketMap.set(item.ticketId, item.quantity);
                            }
                        }
                    });
                    console.log(batchedRequests, batchSize, ticketMap);
                    if (batchSize >= 1) {
                        await this.processBatchedRequests(batchedRequests, batchSize, ticketMap);
                    }
                }
                catch (error) {
                    throw new Error('Error during cron execution');
                }
            });
        };
    }
};
exports.BatchService = BatchService;
exports.BatchService = BatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, nestjs_redis_1.InjectRedis)()),
    __param(2, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ioredis_1.Redis,
        typeorm_2.Repository])
], BatchService);
//# sourceMappingURL=batch.service.js.map