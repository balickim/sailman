import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Trim } from 'class-sanitizer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Trim()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
