import { User } from './user.entity';
export declare class RefreshToken {
    id: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
