import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Booking } from "./Booking";

@Entity()
export class Playground {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  location!: string;

  @OneToMany(() => Booking, (booking) => booking.playground)
  bookings!: Booking[];
}
