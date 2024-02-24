import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';

// 관리용 module by domain
@Module({
  imports: [AuthModule, UserModule, TicketModule],
})
export class AppModule {}
