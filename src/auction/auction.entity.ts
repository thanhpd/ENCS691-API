import { AuctionType } from 'src/auction/enums/auction-type.enum';
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
import { AuctionStatus } from 'src/auction/enums/auction-status.enum';

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

  @Column({
    nullable: false,
    type: 'enum',
    enum: AuctionType,
    default: AuctionType.TIMED,
  })
  type: AuctionType;

  @ManyToOne(() => User, (user) => user.auctions)
  @JoinColumn({ name: 'creatorId' })
  creator: Relation<User>;

  @Column({
    nullable: false,
    type: 'enum',
    enum: AuctionStatus,
    default: AuctionStatus.PENDING,
  })
  status: 'pending' | 'active' | 'ended';

  @Column({ nullable: false })
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => AuctionLot, (auctionLot) => auctionLot.auction)
  auctionLots: Relation<AuctionLot[]>;
}
