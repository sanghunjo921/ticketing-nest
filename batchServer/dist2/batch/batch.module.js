"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchModule = void 0;
const common_1 = require("@nestjs/common");
const batch_service_1 = require("./batch.service");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const ticket_entity_1 = require("./entity/ticket.entity");
const transaction_entity_1 = require("./entity/transaction.entity");
let BatchModule = class BatchModule {
};
exports.BatchModule = BatchModule;
exports.BatchModule = BatchModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ticket_entity_1.Ticket, transaction_entity_1.Transaction]), nestjs_redis_1.RedisModule],
        providers: [batch_service_1.BatchService],
        exports: [batch_service_1.BatchService],
    })
], BatchModule);
//# sourceMappingURL=batch.module.js.map