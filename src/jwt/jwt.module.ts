import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModuleOptions, JWT_CONFIG } from './jwt.type';

@Module({})
@Global()
export class JwtModule {
  static forRoot(option: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          provide: JWT_CONFIG,
          useValue: option,
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
