import { IsNumber, Max, Min, ValidateIf } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: false,
  })
  @IsNumber()
  @Min(0)
  @ValidateIf((coupon) => coupon.isPercentage === true)
  @Max(100)
  @ValidateIf((coupon) => coupon.isPercentage === false)
  @Max(100000)
  amount: number;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isPercentage: boolean;

  @Column({
    nullable: false,
  })
  expiryDate: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
