import { SessionData } from 'express-session';

declare module 'express-session' {
  interface Session {
    profile?: {
      name: string;
      username: string;
      email: string;
      password: string;
      profileImg: string;
    };
    destroy: (callback: (err: any) => void) => void; 
  }
}   