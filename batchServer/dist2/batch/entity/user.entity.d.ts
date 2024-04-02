import { Membership, Role } from '../type/user.enum';
import { Coupon } from './coupon.entity';
import { DiscountRate } from './discountRate.entity';
import { RefreshToken } from './refreshToken.entity';
import { Ticket } from './ticket.entity';
import { Transaction } from './transaction.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    role: Role;
    membership: Membership;
    createdAt: Date;
    updatedAt: Date;
    discountRate: DiscountRate;
    tickets: Ticket[];
    coupons: Coupon[];
    transactions: Transaction[];
    refreshToken: RefreshToken;
}
