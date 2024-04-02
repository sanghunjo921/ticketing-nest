"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const batch_service_1 = require("./batch/batch.service");
const main_module_1 = require("./main.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(main_module_1.MainModule);
    const batchService = app.get(batch_service_1.BatchService);
    await batchService.initiateCron();
}
bootstrap();
//# sourceMappingURL=main.js.map