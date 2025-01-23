import { Body, Controller, Get, HttpException, Post, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateProfileDto } from './profiles/dto/create-profile.dto';
import { Request, Response } from 'express';
import { error } from 'console';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { validateProfile } from './dto/validateProfile.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Post("/login")
  async login(@Body() CreateProfileDto: CreateProfileDto, @Req() req: any){
    return await this.appService.login(CreateProfileDto, req.session);
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
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Successfully logged out' });
    });
  }

}
