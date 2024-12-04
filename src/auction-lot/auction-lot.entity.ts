import { User } from '../user/user.entity';
import { Bid } from '../bid/bid.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Auction } from '../auction/auction.entity';

@Entity({ name: 'auctionLot' })
export class AuctionLot {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ nullable: false })
  productName: string;

  @Column()
  itemOverview: string;

  @Column()
  paymentShippingDetails: string;

  @Column()
  terms: string;

  @Column()
  estPriceLine: string;

  @Column({ nullable: false })
  startingPrice: number;

  @Column()
  imageUrls: string;

  @ManyToOne(() => User, (user) => user.auctions)
  @JoinColumn({ name: 'creatorId' })
  creator: Relation<User>;

  @ManyToOne(() => Auction, (auction) => auction.auctionLots)
  @JoinColumn({ name: 'auctionId' })
  auction: Relation<Auction>;

  @Column({ nullable: false })
  status: 'pending' | 'active' | 'ended';

  @Column({ nullable: false })
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => Bid, (bid) => bid.auctionLot)
  bids: Relation<Bid[]>;
}
