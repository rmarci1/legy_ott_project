import { Body, Controller, Post, Req, Res, UseGuards, Request, NotAcceptableException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateProfileDto } from '../profiles/dto/create-profile.dto';
import { Response, Request as R } from 'express';
import { validateProfile } from './dtos/validateProfile.dto';
import { AuthGuard } from './guards/Auth-Guard';
import { LoginDto } from './dtos/login.dto';
import { ApiOperation } from '@nestjs/swagger';
import { RefreshAuthGuard } from './guards/refresh/refresh-AuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login with the desired profile',
  })
  @Post('/login')
  async login(
    @Body() LoginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(LoginDto);
    response.clearCookie('ac');
    response.clearCookie('refreshToken');

    response.cookie('ac', token.access_token, {
      sameSite : false,
      httpOnly: true,
      expires: new Date(2322, 1, 1),
    });
    response.cookie('refresh_token', token.refresh_token, { httpOnly: true, sameSite : false });
    return token;
  }

  @ApiOperation({
    summary: 'Register validation for mobile app',
  })
  @Post('/reg1')
  async reg1(
    @Body() validateProfileDto: validateProfile,
    @Res() res: Response,
  ) {
    const halfProfile = await this.authService.reg1(validateProfileDto);
    return res
      .status(200)
      .json({ message: 'Profile half created', halfProfile: halfProfile });
  }

  @ApiOperation({
    summary: 'Creates a new profile with encrypted password',
  })
  @Post('/register')
  async register(@Body() CreateProfileDto: CreateProfileDto) {
    return await this.authService.register(CreateProfileDto);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response,): Promise<{ access_token: string; refresh_token: string }> {
    response.clearCookie('ac');
    response.clearCookie('refreshToken');
    return;
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  async refreshToken(@Req() req: R,  @Res({ passthrough: true }) response: Response): Promise<{access_token: string}> {
    const refreshToken: string = req.cookies['refreshToken'];
    if(!refreshToken){
      throw new NotAcceptableException('Invalid authorization token!');
    }
    const token = await this.authService.refresh_token(refreshToken);
    response.clearCookie('ac');
    response.cookie('ac', token.access_token, {httpOnly: true, expires: new Date(2322, 1, 1)});
    return token;
  }


  @ApiOperation({
    summary: 'Returns logged in profile',
  })
  @Post('/check-auth')
  @UseGuards(AuthGuard)
  check(@Request() req) {
    return req['profile'];
  }
}
