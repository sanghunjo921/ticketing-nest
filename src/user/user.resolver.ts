import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Test } from 'src/common/decorator/public.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
  SigninInput,
  SigninOutput,
} from './dto/req.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userSerive: UserService) {}

  @Test()
  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    const { ok, error } =
      await this.userSerive.createAccount(createAccountInput);

    return {
      ok,
      error,
    };
  }

  @Test()
  @Mutation(() => SigninOutput)
  async signin(@Args('input') signinInput: SigninInput): Promise<SigninOutput> {
    const { ok, error, token } = await this.userSerive.signin(signinInput);

    return {
      ok,
      error,
      token,
    };
  }
}
