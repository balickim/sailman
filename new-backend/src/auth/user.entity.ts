import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @Column()
  username: string;

  @Column({ nullable: true })
  about: string;

  @Column({ type: 'bytea', nullable: true })
  photo: Buffer;

  @Column({ type: 'jsonb', name: 'refresh_token', nullable: true })
  refreshToken: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
