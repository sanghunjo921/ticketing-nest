import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/user/entity/user.entity';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import { UserModule } from 'src/user/user.module';
import { TicketModule } from 'src/ticket/ticket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Ticket, User]),
    UserModule,
    TicketModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
