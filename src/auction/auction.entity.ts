import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'auction' })
export class Auction {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  name: string;

  @Column()
  creatorId: string;

  @Column()
  thumbnailUrl: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.auctions)
  @JoinColumn({ name: 'creatorId' })
  creator: Relation<User>;
}
