import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nodemailer } from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendEmailWithNodemailer(emailData): nodemailer {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: this.configService.get('GOOGLE_APP_EMAIL'),
        pass: this.configService.get('GOOGLE_APP_PASSWORD'),
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });

    return transporter
      .sendMail(emailData)
      .then((data) => {
        return { data, success: true };
      })
      .catch((err) => console.log(`Problem sending email: ${err}`));
  }
}
