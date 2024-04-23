import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}

export class CreateTicketResDto {}

export class UpdateTicketResDto {}

export class GetImageResDto {
  @ApiProperty()
  image: string;
}
