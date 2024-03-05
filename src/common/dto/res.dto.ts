import { ApiProperty } from '@nestjs/swagger';

export class PageResDto<T> {
  @ApiProperty({
    required: true,
    example: 1,
  })
  page: number;
  @ApiProperty({
    required: true,
    example: 10,
  })
  size: number;
  @ApiProperty({
    required: true,
  })
  items: T[];
}
