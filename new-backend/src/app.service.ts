import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const res = 'Joł';
    return res;
  }
}
