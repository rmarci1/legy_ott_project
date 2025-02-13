import { PassportStrategy } from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {Request} from "express";
import {ExtractJwt, Strategy} from "passport-jwt";
import * as process from "process";
import {JwtPayload} from "jsonwebtoken";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-token'){
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      secretOrKey: `${process.env.refresh_secret}`
    });
  }


  async validate(payload: JwtPayload): Promise<JwtPayload>{
    return payload;
  }


  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'refreshToken' in req.cookies) {
      return req.cookies.refreshToken;
    }
    return null;
  }
}
