import { AuctionLot } from '../auction-lot/auction-lot.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'personalizeSave' })
export class PersonalizeSave {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => User, (user) => user.personalizeSaves)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @ManyToOne(() => AuctionLot, (auctionLot) => auctionLot.personalizeSaves)
  @JoinColumn({ name: 'auctionLotId' })
  auctionLot: Relation<AuctionLot>;
}
