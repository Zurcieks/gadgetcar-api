import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt/jwt-strategy';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { LocalStrategy } from './local.strategy';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { AuthRepository } from './repository/authRepository';
import { TokenService } from './service/token.service';
import { CookieService } from './service/cookie.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRETKEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    AuthRepository,
    TokenService,
    CookieService,
  ],
  exports: [
    AuthService,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
    TokenService,
    AuthRepository,
    CookieService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
