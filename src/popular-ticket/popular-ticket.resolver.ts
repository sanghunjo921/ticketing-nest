import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Test } from 'src/common/decorator/public.decorator';
import { TicketService } from 'src/ticket/ticket.service';
import { CreatePopularTicketDto } from './dto/create-popular-ticket.dto';
import { UpdatePopularTicketDto } from './dto/update-popular-ticket.dto';
import { PopularTicket } from './models/PopularTicket';

@Resolver()
export class PopularTicketResolver {
  constructor(private readonly ticketService: TicketService) {}

  @Test()
  @Query(() => [PopularTicket])
  getPopularTickets(): PopularTicket[] {
    return [];
  }

  @Test()
  @Query(() => [PopularTicket])
  async getPopularTicketsByCategory(
    @Args('category') category: string,
  ): Promise<PopularTicket[]> {
    const tickets = await this.ticketService.findAll(1, 10);
    return tickets;
    // return TicketService.filter((ticket) => ticket.category.toLowerCase().includes(category.toLowerCase()))
    // return [];
  }

  @Test()
  @Mutation(() => Boolean)
  createPopularTicket(
    @Args('createPopularTicketInput') input: CreatePopularTicketDto,
  ): Boolean {
    const {
      id,
      title,
      description,
      status,
      price,
      remaining_number,
      imagePath,
      createdAt,
      updatedAt,
    } = input;

    return true;
  }

  @Test()
  @Mutation(() => Boolean)
  async updatePopularTicket(
    @Args('updatePopularTicketInput') input: UpdatePopularTicketDto,
    @Args('id') ticketId: number,
  ): Promise<Boolean> {
    await this.ticketService.update(ticketId, input);

    return true;
  }
}
