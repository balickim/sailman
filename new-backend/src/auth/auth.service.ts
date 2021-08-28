import {
  ConflictException,
  HttpException,
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
import { TokenDto } from './dto/token.dto';

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
    lang = 'en',
  ): Promise<void> {
    const { email } = authCredentialsDto;

    const user = await this.usersRepository.findOne({ email });
    if (user) throw new ConflictException('email already exists');

    const token = await this.jwtService.signAsync(authCredentialsDto, {
      secret: this.configService.get('JWT_ACCOUNT_ACTIVATION_SECRET'),
      expiresIn: this.configService.get('JWT_ACCOUNT_ACTIVATION_EXPIRE'),
    });

    const title =
      lang === 'en'
        ? 'Click button below to activate you account'
        : 'Kliknij poniższy przycisk by aktywować konto';
    const buttonText = lang === 'en' ? 'Activate' : 'Aktywuj';

    const emailData = {
      from: `${this.configService.get('GOOGLE_APP_EMAIL')}`,
      to: email,
      subject: `${this.configService.get('APP_NAME')} account activation link`,
      html: `
          <h2>${title}</h2>
          <a href="${this.configService.get(
            'CLIENT_BASE_URL',
          )}/${lang}/auth/account/activate/${token}" style="background-color: blue; font-size: 18px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 14px 20px; color: #ffffff; border-radius: 5px; display: inline-block; miso-padding-alt: 0;">
              <!--[if mso]>
              <i style="letter-spacing: 25px; mso-font-width: -100%; mso-text-raise: 30pt;">&nbsp;</i>
              <![endif]-->
              <span style="mso-text-raise: 15pt;">${buttonText} &rarr;</span>
              <!--[if mso]>
              <i style="letter-spacing: 25px; mso-font-width: -100%;">&nbsp;</i>
              <![endif]-->
          </a>
          ${token}
      `,
    };

    const result = await this.emailService.sendEmailWithNodemailer(emailData);

    return result;
  }

  async signUp(tokenDto: TokenDto): Promise<void> {
    const { token } = tokenDto;

    try {
      await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCOUNT_ACTIVATION_SECRET'),
      });
    } catch (e) {
      throw new HttpException('Link expired.', 403);
    }

    const decoded = await this.jwtService.decode(token);

    return this.usersRepository.createUser(decoded);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };

      const accessToken: string = await this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRE'),
      });

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
