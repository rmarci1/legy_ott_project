import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './profiles/dto/create-profile.dto';
import { PrismaService } from './prisma/prisma.service';
import { ProfilesService } from './profiles/profiles.service';
import * as bcrypt from 'bcrypt';
import { validateProfile } from './dto/validateProfile.dto';
import { LoginDto } from './dto/login.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class AppService {
  constructor( private readonly db: PrismaService, private readonly cloudinary: CloudinaryService, private readonly ps: ProfilesService){}


  async login(LoginDto: LoginDto, session: any){
    let isPasswordValid : boolean;
    let loginMode: "email" | "username";
    let profileWithEmail;
    let profileWithUsername;
    LoginDto.email?
     profileWithEmail = await this.db.profile.findUnique({where: {email: LoginDto.email}})
     :
     profileWithUsername = await this.db.profile.findUnique({
      where: {username: LoginDto.username}
    })

    if (!profileWithUsername && !profileWithEmail) {
      throw new HttpException(
        'Nem megfelelő felhasználónév vagy email cím.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if(profileWithUsername){
      isPasswordValid = await bcrypt.compare(LoginDto.password, profileWithUsername.password);
      loginMode = "username"
      
    }
    else {
      isPasswordValid = await bcrypt.compare(LoginDto.password, profileWithEmail.password);
      loginMode = "email"
    }

    if (!isPasswordValid) {
      throw new HttpException(
        'Nem megfelelő jelszó.',
        HttpStatus.BAD_REQUEST,
      );
    }

    loginMode == "email"
  ? (session.profile = {
      username: profileWithEmail.username,
      password: profileWithEmail.password,
      email: profileWithEmail.email,
      name: profileWithEmail.name,
      advertiser: profileWithEmail.advertiser,
      profileImg: profileWithEmail.profileImg
    })
  : (session.profile = {
      username: profileWithUsername.username,
      password: profileWithUsername.password,
      email: profileWithUsername.email,
      name: profileWithUsername.name,
      advertiser: profileWithUsername.advertiser,
      profileImg: profileWithUsername.profileImg
    });
    return { message: 'Login successful', profile: session.profile };
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
    if(!/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(CreateProfileDto.name)){
      throw new HttpException("Nem megfelelő a név formátuma. Helyes példa: Jakab Zoltán", HttpStatus.BAD_REQUEST)
    }
    if(!/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/.test(CreateProfileDto.username)){
      throw new HttpException("Nem megfelelő a felhasználó név formátuma.", HttpStatus.BAD_REQUEST);
    }

    CreateProfileDto.password = hashedPassword;
    const newProfile = await this.ps.create(CreateProfileDto);

    session.profile = {
      username: (await newProfile).username,
      password: (await newProfile).password,
      name: (await newProfile).name,
      email: (await newProfile).email,
      advertiser: (await newProfile).advertiser
    };

    return {profile: session.profile}
  }

  async reg1(validateProfile:validateProfile){

    const profileWithEmail = await this.db.profile.findUnique({
      where: {email: validateProfile.email}
    });
    if(profileWithEmail){
      throw new HttpException("Már létezik profil ezzel az email-címmel!", HttpStatus.BAD_REQUEST);
    }
    if(validateProfile.password.length < 8){
      throw new HttpException("A jelszónak meg kell lennie 8 karakternek", HttpStatus.BAD_REQUEST);
    }
    if(validateProfile.password != validateProfile.passwordAgain){
      throw new HttpException("A két jelszónak egyeznie kell", HttpStatus.BAD_REQUEST);
    } 

  }

  async getProfilePic(session: any){
    const image = this.db.profile.findUnique({
      where:{
        email: session.profile.email
      },
      select:{
        profileImg: true
      }
    })


    return image
  }


}
