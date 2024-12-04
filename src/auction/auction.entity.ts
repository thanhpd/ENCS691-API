import { AuctionLot } from '../auction-lot/auction-lot.entity';
import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'auction' })
export class Auction {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column()
  thumbnailUrl: string;

  @Column({ nullable: false })
  startAt: Date;

  @Column()
  details: string;

  @Column({ nullable: false })
  type: 'live' | 'timed';

  @ManyToOne(() => User, (user) => user.auctions)
  @JoinColumn({ name: 'creatorId' })
  creator: Relation<User>;

  @Column({ nullable: false })
  status: 'pending' | 'active' | 'ended';

  @Column({ nullable: false })
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => AuctionLot, (auctionLot) => auctionLot.auction)
  auctionLots: Relation<AuctionLot[]>;
}