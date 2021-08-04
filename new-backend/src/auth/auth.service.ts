import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import { JwtPayload } from './jwt-payload.interface';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async preSignUp(
    authCredentialsDto: AuthCredentialsDto,
    siteLang = 'en',
  ): Promise<void> {
    const { email } = authCredentialsDto;

    const user = await this.usersRepository.findOne({ email });
    if (user) throw new ConflictException('email already exists');

    const token = await this.jwtService.signAsync(authCredentialsDto, {
      secret: this.configService.get('JWT_ACCOUNT_ACTIVATION_SECRET'),
      expiresIn: this.configService.get('JWT_ACCOUNT_ACTIVATION_EXPIRE'),
    });

    const emailData = {
      from: `${this.configService.get('GOOGLE_APP_EMAIL')}`,
      to: email,
      subject: `${this.configService.get('APP_NAME')} account activation link`,
      html: `
          <p>Use the following email to activate your account:</p>
          <p>${this.configService.get(
            'CLIENT_BASE_URL',
          )}${siteLang}/auth/account/activate/${token}</p>
      `,
    };

    return await this.emailService.sendEmailWithNodemailer(emailData);
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
