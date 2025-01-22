import { Body, Controller, Get, Post, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateProfileDto } from './profiles/dto/create-profile.dto';

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

  @Post("/register")
  async register(@Body() CreateProfileDto: CreateProfileDto, @Req() req: any){
    return await this.appService.register(CreateProfileDto, req.session);
  }

}
