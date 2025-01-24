import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './profiles/dto/create-profile.dto';
import { PrismaService } from './prisma.service';
import { ProfilesService } from './profiles/profiles.service';
import * as bcrypt from 'bcrypt';
import convertImg from './fileConverter/convert';
import { validateProfile } from './dto/validateProfile.dto';
import { PassThrough } from 'stream';

@Injectable()
export class AppService {
  constructor( private readonly db: PrismaService){}


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

    loginMode == "email"? session.profile = {
      username: profileWithEmail.username,
      password: profileWithEmail.password,
      email: profileWithEmail.email,
      name: profileWithEmail.name,
      advertiser: profileWithEmail.advertiser
    }: session.profile = {
      username: profileWithUsername.username,
      password: profileWithUsername.password,
      email: profileWithUsername.email,
      name: profileWithUsername.name,
      advertiser: profileWithUsername.advertiser
    } ;

    return { message: 'Login successful', user: session.user };
  }

  async register(CreateProfileDto: CreateProfileDto, session: any){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(CreateProfileDto.password, saltRounds);
    const profileWithUsername = await this.db.profile.findUnique({
      where: {username: CreateProfileDto.username}
    });

    if(profileWithUsername){
      throw new HttpException("A felhasználónév már foglalt!", HttpStatus.BAD_REQUEST);
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

    let converted = await convertImg('profile.jpg')
    CreateProfileDto.profileImg = converted;
    const newProfile = await this.db.profile.create({
      data:{
        ...CreateProfileDto,
        password: hashedPassword,
        profileImg: converted
      }
    })

    session.profile = {
      username: (await newProfile).username,
      password: (await newProfile).password,
      name: (await newProfile).name,
      email: (await newProfile).email,
      advertiser: (await newProfile).advertiser
    };
  }

  async reg1(validateProfile:validateProfile){

    let passError;

    const profileWithEmail = await this.db.profile.findUnique({
      where: {email: validateProfile.email}
    });
    if(profileWithEmail){
      throw new HttpException("Már létezik profil ezzel az email-címmel!", HttpStatus.BAD_REQUEST);
    }
    if(validateProfile.password.length < 8){
      passError+= "A jelszónak meg kell lennie 8 karakternek"
    }
    if(validateProfile.password != validateProfile.passwordAgain){
      throw new HttpException("A két jelszónak egyeznie kell", HttpStatus.BAD_REQUEST);
    }


    

  }


}
