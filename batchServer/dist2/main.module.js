"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const postgres_config_1 = require("./config/postgres.config");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const batch_module_1 = require("./batch/batch.module");
let MainModule = class MainModule {
};
exports.MainModule = MainModule;
exports.MainModule = MainModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [postgres_config_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    let typeOrmModuleOptions = {
                        type: configService.get('db.type'),
                        host: configService.get('db.host'),
                        port: configService.get('db.port'),
                        database: configService.get('db.dbName'),
                        username: configService.get('db.username'),
                        password: configService.get('db.password'),
                        autoLoadEntities: true,
                    };
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
            nestjs_redis_1.RedisModule.forRoot({
                config: {
                    host: 'redis',
                    port: 6379,
                },
            }),
            batch_module_1.BatchModule,
        ],
    })
], MainModule);
//# sourceMappingURL=main.module.js.map