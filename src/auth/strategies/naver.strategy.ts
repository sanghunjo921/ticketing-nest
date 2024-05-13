import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';

export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: '/oauth2/redirect/naver',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      const email = profile._json.email;
      const user = {
        email,
      };
      return user;
    } catch (error) {
      throw new Error('Error occured during naver login');
    }
  }
}
