import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Playground } from "./Playground";
import { User } from "./User";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  time!: string; // Use ISO 8601 format for simplicity

  @Column()
  description!: string;

  @ManyToOne(() => Playground, (playground) => playground.bookings)
  playground!: Playground;

  @ManyToOne(() => User, (user) => user.createdBookings)
  author!: User;

  @ManyToMany(() => User)
  @JoinTable()
  participants!: User[];
}
