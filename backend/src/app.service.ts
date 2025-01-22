import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './profiles/dto/create-profile.dto';
import { PrismaService } from './prisma.service';
import { ProfilesService } from './profiles/profiles.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(private readonly ps: ProfilesService, private readonly db: PrismaService){}


  getHello(): string {
    return 'Hello World!';
  }


  async login(CreateProfileDto: CreateProfileDto, session: any){

    let isPasswordValid;
    let loginMode;
    
    const profileWithEmail = await this.db.profile.findUnique({
      where: {email: CreateProfileDto.email}
    })

    const profileWithUsername = await this.db.profile.findUnique({
      where: {username: CreateProfileDto.username}
    })

    if (!profileWithUsername && !profileWithEmail) {
      throw new HttpException(
        'Nem megfelelő felhasználónév vagy email cím.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if(profileWithUsername){
      isPasswordValid = await bcrypt.compare(CreateProfileDto.password, profileWithUsername.password);
      loginMode = "username"
      
    }
    else {
      isPasswordValid = await bcrypt.compare(CreateProfileDto.password, profileWithEmail.password);
      loginMode = "email"
    }

    if (!isPasswordValid) {
      throw new HttpException(
        'Nem megfelelő jelszó.',
        HttpStatus.BAD_REQUEST,
      );
    }

    loginMode == "email"? session.user = {
      username: profileWithEmail.username,
      password: profileWithEmail.password,
    }: session.user = {
      username: profileWithUsername.username,
      password: profileWithUsername.password,
    } ;

    return { message: 'Login successful', user: session.user };
  }

  async register(CreateProfileDto: CreateProfileDto, session: any){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(CreateProfileDto.password, saltRounds);
    const profileWithEmail = await this.db.profile.findUnique({
      where: {email: CreateProfileDto.email}
    });
    const profileWithUsername = await this.db.profile.findUnique({
      where: {username: CreateProfileDto.username}
    });

    if(profileWithUsername){
      throw new HttpException("A felhasználónév már foglalt!", HttpStatus.BAD_REQUEST);
    }
    else if(profileWithEmail){
      throw new HttpException("Ehhez az email címhez van már regisztrálva fiók!", HttpStatus.BAD_REQUEST);
    }

    if(!/^[a-z|0-9|A-Z]*([_][a-z|0-9|A-Z]+)*([.][a-z|0-9|A-Z]+)*([.][a-z|0-9|A-Z]+)*(([_][a-z|0-9|A-Z]+)*)?@[a-z][a-z|0-9|A-Z]*\.([a-z][a-z|0-9|A-Z]*(\.[a-z][a-z|0-9|A-Z]*)?)$/.test(CreateProfileDto.email)){
      throw new HttpException("Nem megfelelő formátumú az email cím", HttpStatus.BAD_REQUEST);
    }
    if(!/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(CreateProfileDto.name)){
      throw new HttpException("Nem megfelelő a név formátuma. Helyes példa: Jakab Zoltán", HttpStatus.BAD_REQUEST)
    }
    if(!/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/.test(CreateProfileDto.username)){
      throw new HttpException("Nem megfelelő a felhasználó név formátuma.", HttpStatus.BAD_REQUEST);
    }

    const newProfile = this.db.profile.create({
      data:{
        ...CreateProfileDto,
        password: hashedPassword
      }
    })

    session.user = {
      username: newProfile.username,
      password: newProfile.password
    };

  }
}
