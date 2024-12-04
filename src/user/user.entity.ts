import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Auction } from '../auction/auction.entity';
import { Bid } from '../bid/bid.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  avatarUrl: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: false })
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToMany(() => Auction, (auction) => auction.creator)
  auctions: Relation<Auction[]>;

  @OneToMany(() => Bid, (bid) => bid.bidder)
  bids: Relation<Bid[]>;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
