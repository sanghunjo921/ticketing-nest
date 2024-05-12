import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: '/oauth2/redirect/kakao',
      scope: ['account_email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      const email = profile._json.kakao_account.email;
      const user = {
        email,
      };
      return user;
    } catch (error) {
      throw new Error('Error occured during kakao login');
    }
  }
}
