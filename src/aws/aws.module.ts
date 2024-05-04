import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AwsService],
  controllers: [AwsController],
  exports: [AwsService],
  imports: [ConfigModule],
})
export class AwsModule {}
