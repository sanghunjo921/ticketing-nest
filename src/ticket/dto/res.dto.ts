import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Comment } from 'src/comment/entities/comment.entity';

export class FindTicketResDto {
  @ApiProperty({
    required: true,
  })
  id: number;
  @ApiProperty({
    required: true,
  })
  title: string;
  @ApiPropertyOptional({
    required: false,
  })
  desc?: string;

  imagePath?: string;

  comments: Comment[];
}

export class CreateTicketResDto {}

export class UpdateTicketResDto {}

export class GetImageResDto {
  @ApiProperty()
  image: string;
}
