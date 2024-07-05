import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  AuthUser,
  AuthUserType,
} from 'src/common/decorator/auth-user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentReqDto, UpdateCommentDto } from './dto/req.dto';
import { CreateCommentResDto } from './dto/res.dto';
import { Comment } from './entities/comment.entity';

@Controller('ticket/:ticketId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  createComment(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body()
    createCommentReqDto: CreateCommentReqDto,
    @AuthUser() user: AuthUserType,
  ): Promise<CreateCommentResDto> {
    if (user.id) {
      createCommentReqDto.userId = user.id;
    }

    createCommentReqDto.ticketId = ticketId;

    return this.commentService.createComment(createCommentReqDto);
  }

  @Get()
  getAllCommentsByTicket(
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ): Promise<Comment[]> {
    return this.commentService.getAllCommentsByTicket(ticketId);
  }

  @Get(':id')
  getCommentByPost(
    @Param('id', ParseIntPipe) id: number,
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ): Promise<Comment> {
    return this.commentService.getCommentByTicket(id, ticketId);
  }

  @Patch(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostReqDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentService.updateComment(id, updatePostReqDto);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.deleteComment(id);
  }
}
