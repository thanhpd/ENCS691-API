import { User } from '../user/user.entity';
import { Bid } from '../bid/bid.entity';
import {
  BeforeInsert,
  BeforeUpdate,
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

  @Column()
  productName: string;

  @Column({ nullable: true })
  itemOverview: string;

  @Column({ nullable: true })
  paymentShippingDetails: string;

  @Column({ nullable: true })
  terms: string;

  @Column({ nullable: true })
  estPriceLine: string;

  @Column()
  startingPrice: number;

  @Column({ nullable: true, type: 'simple-array' })
  imageUrls: string[];

  @ManyToOne(() => User, (user) => user.auctions)
  @JoinColumn({ name: 'creatorId' })
  creator: Relation<User>;

  @ManyToOne(() => Auction, (auction) => auction.auctionLots)
  @JoinColumn({ name: 'auctionId' })
  auction: Relation<Auction>;

  @Column()
  status: 'pending' | 'active' | 'ended';

  @Column()
  startAt: Date;

  @Column({ nullable: true })
  endAt: Date;

  @Column({ default: 5 })
  intervalInMinutes: number;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @OneToMany(() => Bid, (bid) => bid.auctionLot)
  bids: Relation<Bid[]>;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}
