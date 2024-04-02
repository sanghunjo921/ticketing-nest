import { User } from './user.entity';
export declare class Coupon {
    id: number;
    code: string;
    amount: number;
    isPercentage: boolean;
    expiryDate: number;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
}
