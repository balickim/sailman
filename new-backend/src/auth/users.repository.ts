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
    const username = email.substring(0, email.indexOf('@'));

    try {
      const user = this.create({
        email,
        password: hashedPassword,
        username,
      });

      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('email already exists');
      } else {
        console.log(
          '%cusers.repository.ts line:32 error',
          'color: #007acc;',
          error,
        );
        throw new InternalServerErrorException();
      }
    }
  }
}
