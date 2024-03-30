import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ReserveTicketReqDto, UpdateUserReqDto } from './dto/req.dto';
import { UserResDto, UsersResDto } from './dto/res.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { TicketService } from 'src/ticket/ticket.service';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import { Membership } from './type/user.enum';
import { DiscountRate } from 'src/discount-rate/entity/discountRate.entity';
import { Transaction } from './entity/transaction.entity';
import { Coupon } from 'src/coupon/entity/coupon.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRedis()
    private readonly redisService: Redis,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(DiscountRate)
    private readonly discountRepository: Repository<DiscountRate>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async findAll(page: number, size: number) {
    const skip = (page - 1) * size;
    return this.userRepository.find({ skip: skip, take: size });
  }

  async findOne(id: string): Promise<UserResDto> {
    console.log({ id });
    return this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<UserResDto> {
    return this.userRepository.findOneBy({ email });
  }

  async create(email: string, password: string) {
    const user = this.userRepository.create({ email, password });

    const discountRate = await this.discountRepository.findOne({
      where: {
        membershipLevel: 'bronze',
      },
    });

    user.discountRate = discountRate;

    await this.userRepository.save(user);
    return user;
  }

  async update(id: string, updateData: UpdateUserReqDto) {
    const target = await this.findOne(id);

    const { affected } = await this.userRepository.update(id, updateData);

    if (affected === 0) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return { ...target, ...updateData };
  }

  async delete(id: string) {
    const { affected } = await this.userRepository.delete(id);

    if (affected === 0) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return 'deleted';
  }

  async reserveTicket(id: string, ticketId: number, quantity: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tickets'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const ticket = await this.ticketRepository.findOne({
      where: {
        id: ticketId,
      },
    });

    if (!ticket) {
      throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
    }

    const remainingQuantity = ticket.remaining_number;

    const quantityKey = `${id}-${ticketId}:reservedQuantity`;
    let reservedQuantity =
      JSON.parse(await this.redisService.get(quantityKey)) ?? 0;

    if (!reservedQuantity) {
      await this.redisService.set(quantityKey, 0);
    }

    if (remainingQuantity < reservedQuantity || remainingQuantity < quantity) {
      throw new HttpException('No enough tickets', HttpStatus.BAD_REQUEST);
    }

    await this.redisService.incrby(quantityKey, quantity);

    console.log({ reservedQuantity });

    user.tickets.push(ticket);

    await this.userRepository.save(user);

    return user.tickets;

    // await this.userRepository.update(id, {tickets: })

    // if (ticketRemainingData && RemainingData < amount) {
    //   throw new HttpException('Ticket is sold out', HttpStatus.BAD_REQUEST);
    // }

    // if (!ticket) {
    //   throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
    // }

    // if (RemainingData > amount) {
    //   RemainingData -= 1;
    // }

    // newticketData = {
    //   status: ticket.status,
    //   price: ticket.price,
    // };
  }

  async issueCoupon(id: string, couponId: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['coupons'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const coupon = await this.couponRepository.findOne({
      where: {
        id: couponId,
      },
    });

    if (!coupon) {
      throw new HttpException('Coupon not found', HttpStatus.NOT_FOUND);
    }

    user.coupons.push(coupon);

    await this.userRepository.save(user);

    return user.coupons;
  }

  async purchase(id: string, ticketId: number, couponId: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tickets', 'coupons', 'discountRate'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const ticket = user.tickets.find((ticket) => ticket.id === ticketId);

    if (!ticket) {
      throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
    } else {
      const index = user.tickets.findIndex((ticket) => ticket.id === ticketId);
      if (index !== -1) {
        console.log(index);
        user.tickets.splice(index, 1);
      }

      let appliedPrice: number = ticket.price;

      const coupon = user.coupons.find((coupon) => coupon.id === couponId);

      if (coupon) {
        if (coupon.isPercentage) {
          appliedPrice = Math.ceil(
            appliedPrice - (appliedPrice * coupon.amount) / 100,
          );
        } else {
          appliedPrice = Math.max(appliedPrice - coupon.amount, 0);
        }
        const index = user.coupons.findIndex((c) => c.id === couponId);
        if (index !== -1) {
          user.coupons.splice(index, 1);
        }
      }
      let discountRatio: number = user.discountRate.discountRatio;

      appliedPrice -= appliedPrice * discountRatio;
      appliedPrice = Math.ceil(appliedPrice);

      const key = `${id}-${ticketId}`;
      // let reservedQuantity = this.reservedQuantities.get(key);
      // this.reservedQuantities.delete(key);

      // const newRemaining = ticket.remaining_number - reservedQuantity;

      // await this.ticketRepository.update(ticketId, {
      //   remaining_number: newRemaining,
      // });

      const transactionData = {
        userId: id,
        ticketId: ticketId,
        couponId: coupon ? couponId : null,
        totalPrice: appliedPrice,
        // quantity: reservedQuantity,
        createdAt: new Date(),
      };

      await this.transactionRepository.save(transactionData);
      await this.userRepository.save(user);
      return transactionData;
    }
  }

  async getPurchaseHistory(id: string, page: number, size: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['transactions'],
    });

    return user.transactions;
  }
}
