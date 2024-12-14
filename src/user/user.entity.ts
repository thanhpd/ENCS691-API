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
import { PersonalizeSave } from '../personalize-save/personalize-save.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @OneToMany(() => Auction, (auction) => auction.creator)
  auctions: Relation<Auction[]>;

  @OneToMany(() => Bid, (bid) => bid.bidder)
  bids: Relation<Bid[]>;

  @OneToMany(() => PersonalizeSave, (personalizeSave) => personalizeSave.user)
  personalizeSaves: Relation<PersonalizeSave[]>;

  @Column({ nullable: true })
  isDeregistered: boolean;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
