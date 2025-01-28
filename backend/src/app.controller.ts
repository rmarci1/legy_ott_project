import { Body, Controller, Get, HttpException, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateProfileDto } from './profiles/dto/create-profile.dto';
import { Request, Response } from 'express';
import { validateProfile } from './dto/validateProfile.dto';
import { AuthGuard } from './Auth-Guard';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/login")
  async login(@Body() LoginDto: LoginDto, @Req() req: any){
    return await this.appService.login(LoginDto, req.session);
  }

  @Get("/profilePic")
  //@UseGuards(AuthGuard)
  async getProfilePic(@Req() req: any, @Res() res: Response){
    const image = await this.appService.getProfilePic(req.session);
    if (image && image.profileImg) {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'inline; filename="profilePic.png"');
    
      res.end(image.profileImg); 

    } else {
      res.status(404).send('Profile image not found');
    }

  }

  @Post("/reg1")
  async reg1(@Body() validateProfileDto: validateProfile, @Res() res:Response){
      const halfProfile = await this.appService.reg1(validateProfileDto);
      return res.status(200).json({ message: 'Profile half created', halfProfile: halfProfile });
  }

  @Post("/register")
  async register(@Body() CreateProfileDto: CreateProfileDto, @Req() req: any){
     return await this.appService.register(CreateProfileDto, req.session);
  }

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

  @Post("/check-auth")
  @UseGuards(AuthGuard)
  check(@Req() req: Request){
    console.log('Session profile in check-auth:', req.session.profile);
    return { profile: req.session.profile };
  }

}
