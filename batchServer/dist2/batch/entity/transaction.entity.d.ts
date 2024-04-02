import { User } from './user.entity';
export declare class Transaction {
    id: number;
    ticketId: number;
    couponId: number;
    totalPrice: number;
    quantity: number;
    createdAt: Date;
    startTime: number;
    user: User;
}
