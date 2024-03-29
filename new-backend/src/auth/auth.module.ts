import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from './users.repository';
import { JwtStrategy } from './jwt.strategy';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UsersRepository]),
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy, EmailService, ConfigService],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule, ConfigModule],
})
export class AuthModule {}
