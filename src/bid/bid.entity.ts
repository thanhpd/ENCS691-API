import { AuctionLot } from '../auction-lot/auction-lot.entity';
import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'bid' })
export class Bid {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ nullable: false })
  amount: number;

  @ManyToOne(() => User, (user) => user.bids)
  @JoinColumn({ name: 'bidderId' })
  bidder: Relation<User>;

  @ManyToOne(() => AuctionLot, (auctionLot) => auctionLot.bids)
  @JoinColumn({ name: 'auctionLotId' })
  auctionLot: Relation<AuctionLot>;

  @Column({ nullable: false })
  createdAt: Date;
}
