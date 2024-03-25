import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MembershipLevel } from '../type/discountRate.enum';

const discountRates = {
  platinum: 0.1,
  gold: 0.08,
  silver: 0.05,
  bronze: 0.03,
};

@Entity()
export class DiscountRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    enum: Object.values(MembershipLevel),
    unique: true,
  })
  membershipLevel: MembershipLevel;

  @Column({ type: 'float', nullable: false })
  discountRatio: number;
}

export const discountRateInstances = Object.keys(discountRates).map(
  (membershipLevel: MembershipLevel) => ({
    membershipLevel,
    discountRatio: discountRates[membershipLevel],
  }),
);
