"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('db', () => ({
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dbName: process.env.DB_NAME || 'ticketing_db',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
}));
//# sourceMappingURL=postgres.config.js.map