import { MembershipLevel } from '../type/discountRate.enum';
import { User } from './user.entity';
export declare class DiscountRate {
    id: number;
    membershipLevel: string;
    discountRatio: number;
    users: User[];
}
export declare const discountRateInstances: {
    membershipLevel: MembershipLevel;
    discountRatio: number;
}[];
