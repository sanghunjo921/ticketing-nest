import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentReqDto {
  @MaxLength(30)
  @IsString()
  content: string;

  @IsNumber()
  @IsOptional()
  level?: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsNumber()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @IsOptional()
  ticketId?: number;
}

export class UpdateCommentDto {
  @MaxLength(30)
  @IsString()
  @IsOptional()
  content?: string;
}
