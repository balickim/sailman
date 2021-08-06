import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(decoded): Promise<void> {
    const { email, password } = decoded;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.create({ email, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
