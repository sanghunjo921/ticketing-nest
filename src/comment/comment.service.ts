import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import { TicketService } from 'src/ticket/ticket.service';

import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateCommentReqDto, UpdateCommentDto } from './dto/req.dto';
import { CreateCommentResDto } from './dto/res.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TicketService))
    private readonly ticketService: TicketService,
  ) {}

  async createComment({
    content,
    level,
    parent,
    userId,
    ticketId,
  }: CreateCommentReqDto): Promise<CreateCommentResDto> {
    const user = await this.userService.findOne(userId);
    const ticket = await this.ticketService.findOne(ticketId);

    const newComment = this.commentRepository.create({
      content,
      level,
      parent,
    });

    const groupedComments = ticket.comments.reduce((acc, comment) => {
      if (!acc[comment.parent]) {
        acc[comment.parent] = [];
      }
      acc[comment.parent].push(comment);
      return acc;
    }, {});

    // Sorting comments within each parent group by createdAt
    Object.keys(groupedComments).forEach((parentId) => {
      groupedComments[parentId].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    });

    // Push the new comment to the appropriate parent group
    if (!groupedComments[newComment.parent]) {
      groupedComments[newComment.parent] = [];
    }
    groupedComments[newComment.parent].push(newComment);

    // Flatten the grouped comments back into a single array
    ticket.comments = Object.values(groupedComments).flat();

    await this.ticketRepository.save(ticket);
    await this.commentRepository.save(newComment);

    return newComment;
  }

  async getAllCommentsByTicket(ticketId: number): Promise<Comment[]> {
    const targetTicket = await this.ticketService.findOne(ticketId);

    const comments = targetTicket.comments;

    comments.sort((commentA, commentB) => {
      return (
        commentA.parent - commentB.parent ||
        commentA.createdAt.getTime() - commentB.createdAt.getTime()
      );
    });

    return comments;
  }

  async getCommentByTicket(id: number, ticketId: number): Promise<Comment> {
    try {
      const targetPost = await this.ticketService.findOne(ticketId);

      if (!targetPost) {
        throw new Error('Post not found or already deleted');
      }

      const targetComment = targetPost.comments.find(
        (comment) => comment.id === id && comment.isDeleted === 'N',
      );

      if (!targetComment) {
        throw new Error('Comment not found or already deleted');
      }

      return targetComment;
    } catch (error) {
      throw error;
    }
  }

  async updateComment(
    id: number,
    updateDate: UpdateCommentDto,
  ): Promise<Comment> {
    try {
      const targetComment = await this.commentRepository.findOne({
        where: { id },
      });

      const { affected } = await this.commentRepository.update(id, updateDate);

      if (affected === 0) {
        throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
      }

      return { ...targetComment, ...updateDate };
    } catch (error) {
      throw error;
    }
  }

  async deleteCommentsByTicketId(ticketId: number): Promise<any> {
    try {
      const targetTicket = await this.ticketService.findOne(ticketId);

      console.log({ targetTicket });

      return this.commentRepository.update(
        {
          ticket: targetTicket,
        },
        {
          isDeleted: 'Y',
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(id: number): Promise<Comment> {
    try {
      const targetComment = await this.commentRepository.findOne({
        where: { id },
      });
      if (!targetComment) {
        throw new Error('Comment not found or already deleted');
      }
      targetComment.isDeleted = 'Y';
      await this.commentRepository.save(targetComment);

      return targetComment;
    } catch (error) {
      throw error;
    }
  }
}
