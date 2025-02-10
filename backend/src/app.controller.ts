import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateProfileDto } from './profiles/dto/create-profile.dto';
import { Request, Response } from 'express';
import { validateProfile } from './dto/validateProfile.dto';
import { AuthGuard } from './Auth/Auth-Guard';
import { LoginDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Login with the desired profile'
  })
  @Post("/login")
  async login(@Body() LoginDto: LoginDto, @Req() req: any){
    console.log(req.body)
    return await this.appService.login(LoginDto, req.session);
  }

  @ApiOperation({
    summary: 'Register validation for mobile app'
  })
  @Post("/reg1")
  async reg1(@Body() validateProfileDto: validateProfile, @Res() res:Response){
      const halfProfile = await this.appService.reg1(validateProfileDto);
      return res.status(200).json({ message: 'Profile half created', halfProfile: halfProfile });
  }

  @ApiOperation({
    summary: 'Creates a new profile with encrypted password'
  })
  @Post("/register")
  async register(@Body() CreateProfileDto: CreateProfileDto, @Req() req: any){
     return await this.appService.register(CreateProfileDto, req.session);
  }

  @ApiOperation({
    summary: 'Logs out and destroys session'
  })
  @Post("/logout")
  async logout(@Req() req: Request, @Res() res: Response){

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Nem sikerült a kijelentkezés!' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Sikeresen kijelentkezett!' });
    });
  }


  @ApiOperation({
    summary: 'Returns logged in profile'
  })
  @Post("/check-auth")
  @UseGuards(AuthGuard)
  check(@Req() req: Request){
    return { profile: req.session.profile };
  }

}
