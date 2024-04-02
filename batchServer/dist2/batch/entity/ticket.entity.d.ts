import { Status } from '../type/ticket.enum';
import { User } from './user.entity';
export declare class Ticket {
    id: number;
    title: string;
    description: string;
    status: Status;
    price: number;
    remaining_number: number;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
}
