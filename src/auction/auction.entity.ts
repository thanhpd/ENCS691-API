import { AuctionType } from '../auction/enums/auction-type.enum';
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
import { AuctionStatus } from '../auction/enums/auction-status.enum';

@Entity({ name: 'auction' })
export class Auction {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column()
  startAt: Date;

  @Column({ nullable: true })
  details: string;

  @Column({
    type: 'enum',
    enum: AuctionType,
    default: AuctionType.TIMED,
  })
  type: AuctionType;

  @ManyToOne(() => User, (user) => user.auctions)
  @JoinColumn({ name: 'creatorId' })
  creator: Relation<User>;

  @Column({
    type: 'enum',
    enum: AuctionStatus,
    default: AuctionStatus.PENDING,
  })
  status: 'pending' | 'active' | 'ended';

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @OneToMany(() => AuctionLot, (auctionLot) => auctionLot.auction)
  auctionLots: Relation<AuctionLot[]>;
}
