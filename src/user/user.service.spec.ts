import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

class MockUserRepository {
  async find() {
    return [{ id: '1', email: 'test@test.com' }];
  }

  async findOne(query) {
    const user: User = new User();
    user.id = query.id;
    user.email = query.email;
    return user;
  }
}

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have the same data', async () => {
    const id = '12456';
    const result = await service.findOne(id);

    expect(result.id).toBe(id);
  });

  it('should have the same data', async () => {
    const email = 'test@test.com';
    const result = await service.findOne(email);

    expect(result.email).toBe(email);
  });
});
