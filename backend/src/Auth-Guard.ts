import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    console.log('Session profile in check-auth:', request.session.profile);
    if (!request.session || !request.session.profile) {
      throw new UnauthorizedException('Nincs bejelentkezve');
    }
    
    return true; 
  }
}