import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class FindTicketReqDto {
  @ApiProperty({
    required: true,
  })
  @IsUUID()
  id: string;
}

export class CreateTicketReqDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  title: string;

  @ApiPropertyOptional()
  @IsString()
  desc?: string;
}
