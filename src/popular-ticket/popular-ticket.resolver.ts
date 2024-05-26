import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Test } from 'src/common/decorator/public.decorator';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import { TicketService } from 'src/ticket/ticket.service';
import { Category } from 'src/ticket/type/ticket.enum';
import {
  CreatePopularTicketInput,
  CreatePopularTicketOutput,
} from './dto/create-popular-ticket.dto';
import { UpdatePopularTicketDto } from './dto/update-popular-ticket.dto';
import { PopularTicketService } from './popular-ticket.service';

@Resolver()
export class PopularTicketResolver {
  constructor(
    private readonly popularTicketService: PopularTicketService,
    private readonly ticketService: TicketService,
  ) {}

  @Test()
  @Query(() => [Ticket])
  getPopularTickets(): Promise<Ticket[]> {
    return this.popularTicketService.getPopularTickets();
  }

  @Test()
  @Query(() => [Ticket])
  async getPopularTicketsByCategory(
    @Args('input') category: Category,
  ): Promise<Ticket[]> {
    return this.popularTicketService.getPopularTicketsByCategory(category);
  }

  @Test()
  @Query(() => [Ticket])
  async getFilteredTickets(
    @Args('input') searchTerm: string,
  ): Promise<Ticket[]> {
    return this.ticketService.getFilteredTickets(1, 10, searchTerm);
  }

  @Test()
  @Mutation(() => CreatePopularTicketOutput)
  createPopularTicket(
    @Args('input') input: CreatePopularTicketInput,
  ): Promise<CreatePopularTicketOutput> {
    return this.popularTicketService.createTicket(input);
  }

  @Test()
  @Mutation(() => Boolean)
  async updatePopularTicket(
    @Args('input') input: UpdatePopularTicketDto,
    @Args('id') ticketId: number,
  ): Promise<Boolean> {
    await this.ticketService.update(ticketId, input);

    return true;
  }

  @Test()
  @Mutation(() => Boolean)
  async deletePopularTicket(@Args('id') ticketId: number): Promise<Boolean> {
    await this.ticketService.delete(ticketId);

    return true;
  }
}
