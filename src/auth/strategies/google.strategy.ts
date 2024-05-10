// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import * as dotenv from 'dotenv';

// dotenv.config();

// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor() {
//     super({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: '/oauth2/redirect/google',
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ) {
//     try {
//       const { emails } = profile;
//       const user = {
//         email: emails[0].value,
//       };
//       done(null, user);
//     } catch (error) {
//       done(error);
//     }
//   }
// }
