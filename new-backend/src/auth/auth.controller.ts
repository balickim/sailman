import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/pre-signup/:lang')
  @ApiResponse({ status: 201 })
  preSignUp(
    @Param('lang') lang: string,
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.preSignUp(authCredentialsDto, lang);
  }

  @Post('/signup')
  signUp(@Body() tokenDto: TokenDto): Promise<void> {
    return this.authService.signUp(tokenDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
