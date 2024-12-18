import { AuctionLot } from '../auction-lot/auction-lot.entity';
import { User } from '../user/user.entity';
import {
  BeforeInsert,
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

  @Column()
  amount: number;

  @ManyToOne(() => User, (user) => user.bids)
  @JoinColumn({ name: 'bidderId' })
  bidder: Relation<User>;

  @ManyToOne(() => AuctionLot, (auctionLot) => auctionLot.bids)
  @JoinColumn({ name: 'auctionLotId' })
  auctionLot: Relation<AuctionLot>;

  @Column()
  createdAt: Date;

  @Column({ default: false })
  isHighestBid: boolean;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }
}
