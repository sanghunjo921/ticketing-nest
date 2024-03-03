import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PageResDto } from '../dto/res.dto';

export const ApiPostResponse = <T extends Type<any>>(
  modelDto: T,
  description: string = '',
) => {
  return applyDecorators(
    ApiCreatedResponse({
      type: modelDto,
      description,
    }),
  );
};

export const ApiGetResponse = <T extends Type<any>>(
  modelDto: T,
  description: string = '',
) => {
  return applyDecorators(
    ApiOkResponse({
      type: modelDto,
      description,
    }),
  );
};

export const ApiGetPageResponse = <T extends Type<any>>(
  modelDto: T,
  description: string = '',
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageResDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(modelDto),
                },
              },
            },
            required: ['items'],
          },
        ],
      },
      description,
    }),
  );
};
