import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
 
import { User, UserSchema } from 'src/schemas/User.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard';
import { AuthService } from 'src/auth/auth.service';
import { LocalStrategy } from 'src/auth/local.strategy';
import { JwtStrategy } from 'src/auth/jwt/jwt-strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    JwtModule.register({
      secret: process.env.SECRETKEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],

 
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, AuthService, LocalStrategy, JwtStrategy],
})
export class UserModule {}
