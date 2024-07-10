import { IsOptional } from 'class-validator';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Comment, (parent) => parent.childComments, {
    nullable: true,
  })
  @JoinColumn()
  parent: Comment;

  @OneToMany(() => Comment, (childComment) => childComment.parent)
  @JoinColumn()
  childComments: Comment[];

  @Column({ default: 1 })
  level: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: 'N' })
  isDeleted: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Ticket, (ticket) => ticket.comments)
  @JoinColumn()
  ticket: Ticket;
}
