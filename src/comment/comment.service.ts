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
import { User } from 'src/user/entity/user.entity';

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TicketService))
    private readonly ticketService: TicketService,
  ) {}

  async createComment({
    content,
    level,
    parentId,
    userId,
    ticketId,
  }: CreateCommentReqDto): Promise<CreateCommentResDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const ticket = await this.ticketService.findOne(ticketId);
    const parent: Comment | null = parentId
      ? await this.commentRepository.findOne({ where: { id: parentId } })
      : null;

    const newComment: Comment = this.commentRepository.create({
      content,
      parent,
      level,
      user,
      ticket,
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

    const parentComment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    const targetComments = await this.commentRepository.find({
      where: { parent: parentComment },
      skip,
      take: size,
    });

    return targetComments;
  }

  async getCommentTree(commentId: number): Promise<Comment> {
    const rootComment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['childComments'],
    });

    async function fetchChildren(comment: Comment): Promise<Comment> {
      const children = await this.commentRepository.find({
        where: { parent: comment },
        relations: ['childComments'],
      });

      comment.childComments = await Promise.all(
        children.map((child) => fetchChildren(child)),
      );
      return comment;
    }

    return fetchChildren.call(this, rootComment);
  }

  async paginateChildrenComments(
    commentId: number,
    page: number,
    size: number,
  ): Promise<{ children: Comment[]; totalCount: number; totalPages: number }> {
    const skip = (page - 1) * size;

    const [children, totalCount] = await this.commentRepository.findAndCount({
      where: { parent: { id: commentId } },
      relations: ['childComments'],
      skip,
      take: size,
    });

    const totalPages = Math.ceil(totalCount / size);

    return { children, totalCount, totalPages };
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
