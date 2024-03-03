import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindTicketResDto {
  @ApiProperty({
    required: true,
  })
  id: string;
  @ApiProperty({
    required: true,
  })
  title: string;
  @ApiPropertyOptional({
    required: false,
  })
  desc?: string;
}

export class CreateTicketResDto {}
