import { Controller, Get, Req, Res, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

interface OAuthUser {
  googleId?: string;
  githubId?: string;
  email?: string;
  name?: string;
  avatar?: string;
  provider: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: any) {
    const { user, accessToken } = await this.authService.validateOAuthLogin(req.user as OAuthUser);
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}&userId=${user.id}`;
    return res.redirect(redirectUrl);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req: any, @Res() res: any) {
    const { user, accessToken } = await this.authService.validateOAuthLogin(req.user as OAuthUser);
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}&userId=${user.id}`;
    return res.redirect(redirectUrl);
  }
}
