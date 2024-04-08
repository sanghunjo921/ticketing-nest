import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ReserveTicketReqDto, UpdateUserReqDto } from './dto/req.dto';
import { UserResDto, UsersResDto } from './dto/res.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import { Role } from './type/user.enum';
import { DiscountRate } from 'src/discount-rate/entity/discountRate.entity';
import { Transaction } from './entity/transaction.entity';
import { Coupon } from 'src/coupon/entity/coupon.entity';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { RabbitMqService } from 'src/rabbit-mq/rabbit-mq.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

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
    private readonly rabbitMqService: RabbitMqService,
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
    const multi = this.redisService.multi();

    this.logger.log('Retrieval of User data');
    const user: User = await this.userRepository.findOne({
      where: { id },
    });
    this.logger.log('Found a user');

    if (!user) {
      multi.discard();
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const ticketKey: string = `user:${id}-ticket:${ticketId}`;
    const ticketRemainingKey: string = `ticket:${ticketId}:remaining`;
    const quantityKey: string = `${ticketKey}:reservedQuantity`;

    this.logger.log('Accessing to Redis to get data');
    let [ticketData, ticketRemainingData, reservedQuantity] =
      await this.redisService
        .mget(ticketKey, ticketRemainingKey, quantityKey)
        .then((results) =>
          results.map((item) => (item ? JSON.parse(item) : null)),
        );
    this.logger.log('Finished getting data from Redis', {
      ticketData,
      ticketRemainingData,
      reservedQuantity,
    });

    if (!ticketData) {
      this.logger.log('Accessing to DB to get data');
      ticketData = await this.ticketRepository.findOne({
        where: {
          id: ticketId,
        },
      });
      this.logger.log('Finished getting data from DB');

      if (!ticketData) {
        multi.discard();
        throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
      }

      ticketRemainingData = ticketData.remaining_number;
      reservedQuantity = quantity;

      if (ticketRemainingData < reservedQuantity) {
        multi.discard();
        throw new HttpException('Not enough Tickets', HttpStatus.BAD_REQUEST);
      }

      ticketRemainingData -= quantity;

      this.logger.log('Accessing to Redis to change data');
      multi.mset({
        [ticketKey]: JSON.stringify(ticketData),
        [ticketRemainingKey]: ticketRemainingData,
        [quantityKey]: reservedQuantity,
      });
      this.logger.log('Finished changing data');
    } else {
      if (ticketRemainingData < reservedQuantity) {
        multi.discard();
        throw new HttpException('Not enough Tickets', HttpStatus.BAD_REQUEST);
      }
      this.logger.log('Accessing to Redis to change data');
      await Promise.all([
        multi.incrby(quantityKey, quantity),
        multi.incrby(ticketRemainingKey, -quantity),
      ]);
      this.logger.log('Finished changing data');
    }

    const results = await multi.exec();
    const transactionFailed = results.some((result) => result instanceof Error);

    if (transactionFailed) {
      throw new HttpException(
        'Transaction failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      console.log('success');
    }

    return ticketData;
  }

  async issueCoupon(id: string, couponId: number) {
    const user: User = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const couponKey: string = `user:${id}:coupon:${couponId}`;
    const couponCountKey: string = `${couponKey}:count`;

    let coupon: Coupon = JSON.parse(await this.redisService.get(couponKey));

    if (!coupon) {
      coupon = await this.couponRepository.findOne({
        where: {
          id: couponId,
        },
      });

      if (!coupon) {
        throw new HttpException('Coupon not found', HttpStatus.NOT_FOUND);
      }

      await this.redisService.set(couponKey, JSON.stringify(coupon));
      await this.redisService.set(couponCountKey, 1);
    } else {
      await this.redisService.incrby(couponCountKey, 1);
    }
    return coupon;
  }

  async purchase(id: string, ticketId: number, couponId: number) {
    this.logger.log('Accessing to DB to find user');
    const user: User = await this.userRepository.findOne({
      where: { id },
      relations: ['discountRate'],
    });
    this.logger.log('Found user from DB');

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const ticketKey: string = `user:${id}-ticket:${ticketId}`;
    const quantityKey: string = `${ticketKey}:reservedQuantity`;
    const couponKey: string = `user:${id}:coupon:${couponId}`;
    const couponCountKey: string = `${couponKey}:count`;
    const transactionKey = 'transaction';

    this.logger.log('Accessing to Redis to get data');
    let [ticketData, coupon, couponCount] = await this.redisService
      .mget(ticketKey, couponKey, couponCountKey)
      .then((results) =>
        results.map((item) => (item ? JSON.parse(item) : null)),
      );
    this.logger.log('Found data from Redis');

    if (!ticketData) {
      throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
    }

    let appliedPrice: number = ticketData.price;

    console.log({ coupon, couponCount });

    if (coupon) {
      if (coupon.isPercentage) {
        appliedPrice = Math.ceil(
          appliedPrice - (appliedPrice * coupon.amount) / 100,
        );
      } else {
        appliedPrice = Math.max(appliedPrice - coupon.amount, 0);
      }

      this.logger.log('Accessing to Redis to change coupon data');
      await this.redisService.incrby(couponCountKey, -1);
      this.logger.log('Finished changing coupon data');

      if (couponCount === 0) {
        this.logger.log('Accessing to Redis to delete coupon data');
        await Promise.all([
          await this.redisService.del(couponKey),
          await this.redisService.del(couponCountKey),
        ]);
        this.logger.log('Finished deleting coupon data');
      }
    }
    const discountRatio: number = user.discountRate.discountRatio;

    appliedPrice -= appliedPrice * discountRatio;
    appliedPrice = Math.ceil(appliedPrice);

    // let reservedQuantity = this.reservedQuantities.get(key);
    // this.reservedQuantities.delete(key);

    // const newRemaining = ticket.remaining_number - reservedQuantity;

    // await this.ticketRepository.update(ticketId, {
    //   remaining_number: newRemaining,
    // });

    const transactionData: Transaction = {
      id: null,
      ticketId: ticketId,
      couponId: coupon ? couponId : null,
      totalPrice: appliedPrice,
      quantity: 1,
      createdAt: new Date(),
      user: user,
      startTime: Date.now(),
    };

    this.logger.log('Accessing to Redis to store transactional data');
    await this.redisService.rpush(
      transactionKey,
      JSON.stringify(transactionData),
    );
    this.logger.log('Finished storing transactional data');

    this.rabbitMqService.sendToRabbitMQ(user.id, ticketId, 1, appliedPrice);
    // await this.transactionRepository.save(transactionData);
    return transactionData;
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

  async checkAdminRole(id: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.role === Role.ADMIN;
  }
}
