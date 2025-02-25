import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from '../profiles/dto/create-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import * as bcrypt from 'bcrypt';
import { validateProfile } from './dtos/validateProfile.dto';
import { LoginDto } from './dtos/login.dto';
import { Prisma } from '@prisma/client';
import {PrismaError} from "prisma-error-enum";
import { JwtService } from '@nestjs/jwt';
import { ProfileInterface } from './dtos/profile.interface';
import * as jwt from 'jsonwebtoken';

export type ProfileDataWithoutPassword = Omit<ProfileInterface, "password">
@Injectable()
export class AuthService {
  constructor( private readonly db: PrismaService, private readonly ps: ProfilesService, private jwtService: JwtService){}

  async login(LoginDto: LoginDto) : Promise<{ access_token: string, refresh_token: string }>{
    let isPasswordValid : boolean;
    let loginMode: "email" | "username";
    let profileWithEmail : ProfileInterface;
    let profileWithUsername : ProfileInterface;
    console.log(LoginDto)
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

    profileWithUsername?
      (isPasswordValid = await bcrypt.compare(LoginDto.password, profileWithUsername.password),
          loginMode = 'username')
      : (isPasswordValid = await bcrypt.compare(LoginDto.password, profileWithEmail.password),
      loginMode = "email");

    console.log(loginMode)
    if (!isPasswordValid) {
      throw new HttpException(
        'Nem megfelelő jelszó.',
        HttpStatus.BAD_REQUEST,
      );
    }

      if (profileWithUsername) {profileWithUsername.password = null}
    if (profileWithEmail) {profileWithEmail.password = null}

    const profile = loginMode == "email"?  profileWithEmail : profileWithUsername
    console.log(profile);

    return {
      access_token: await this.jwtService.signAsync(profile, {
        secret: `${process.env.jwt_secret}`,
        expiresIn: '1h'
      }),
      refresh_token: this.jwtService.sign(profile, {
        expiresIn: '1d',
        secret: `${process.env.refresh_secret}`,
      })
    };

  }

  async refresh_token(refreshToken: string): Promise<{access_token: string}>{
    const decodedToken: ProfileDataWithoutPassword = jwt.decode(refreshToken) as {
      id: number,
      username: string,
      email: string,
      name: string,
      advertiser: boolean,
      profileImg: string
    }
    const payload: ProfileDataWithoutPassword = {
      id: decodedToken.id,
      username: decodedToken.username,
      email: decodedToken.email,
      name: decodedToken.name,
      advertiser: decodedToken.advertiser,
      profileImg: decodedToken.profileImg
    }
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1d',
        secret: `${process.env.jwt_secret}`,
      }),
    }
  }


  hashPassword(newPass: string) : string{
      const hashedPassword: string = bcrypt.hashSync(newPass, bcrypt.genSaltSync())
      if (Boolean(bcrypt.compare(newPass,hashedPassword))) {
        return hashedPassword;
      } else {
        throw new Error("Encryption failed")
      }

  }

  async register(CreateProfileDto: CreateProfileDto){
    try{
      let hashedPassword: string;

      hashedPassword = this.hashPassword(CreateProfileDto.password);
        CreateProfileDto.password = hashedPassword;
      await this.ps.create(CreateProfileDto);

      if(!/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/.test(CreateProfileDto.name)){
        throw new BadRequestException("Nem megfelelő a név formátuma. Helyes példa: Jakab Zoltán")
      }
      if(!/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/.test(CreateProfileDto.username)){
        throw new BadRequestException("Nem megfelelő a felhasználó név formátuma.");
      }
    }
    catch (error){
      //TODO: Fix validaton for unique constraint
      if (error instanceof Prisma.PrismaClientKnownRequestError){
        if (error.code === PrismaError.UniqueConstraintViolation &&
          error.meta.target[0] === 'username') {
          throw new BadRequestException("A felhasználónév már használatban van")
        }else if (error.code === PrismaError.UniqueConstraintViolation &&
          error.meta.target[0] === 'email'){
          throw new BadRequestException("Már regisztráltak erről az email címről")
        }

      }
      throw new Error("Error: " + error);
    }
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

}
