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

    ticket.comments.push(newComment);

    await this.ticketRepository.save(ticket);
    await this.commentRepository.save(newComment);

    return newComment;
  }

  async getAllCommentsByTicket(
    ticketId: number,
    page: number,
    size: number,
  ): Promise<Comment[]> {
    const skip = (page - 1) * size;

    const targetComments = await this.commentRepository.find({
      where: { ticket: { id: ticketId }, parent: null },
      skip,
      take: size,
    });

    return targetComments;
  }

  async getChildrenComments(
    commentId: number,
    page: number,
    size: number,
  ): Promise<Comment[]> {
    const skip = (page - 1) * size;

    const targetComments = await this.commentRepository.find({
      where: { parent: commentId },
      skip,
      take: size,
    });

    return targetComments;
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
