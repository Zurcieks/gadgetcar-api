import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

import { EmailService } from './service/sendEmail';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Roles } from './dto/changeRole.dto';

@Injectable()
export class AuthService {
  sendEmail: any;
  constructor(
    private jwtService: JwtService,

    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(createUserDto: RegisterDto): Promise<User> {
    try {
      const { firstName, lastName, email, password } = createUserDto;
      const userExists = await this.userModel.findOne({ email });

      if (userExists) {
        throw new ConflictException(
          'Użytkownik o podanym adresie email istnieje',
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.userModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const verificationToken = this.jwtService.sign(
        { _id: newUser._id }, //Token zawiera id użytkownika, żeby sprawdził który użytkownik dokonał akcji. Przypisuje token do konkretnego użytkownika
        { expiresIn: '1h' },
      );

      const verificationLink = `http://localhost:3000/auth/verify?token=${verificationToken}`;
      await EmailService.sendVerificationEmail(
        email,
        verificationLink,
        firstName,
      );

      return newUser;
    } catch (error) {
      console.error('Błąd podczas rejestracji:', error);
      throw new BadRequestException(
        'Błąd podczas rejestracji użytkownika',
        error.message,
      );
    }
  }

  async changeUserRole(changeRole: Roles, userId: string): Promise<User> {
    const { userRoles } = changeRole;
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Użytkownik nie znaleziony');
    }

    user.role = userRoles[0];
    await user.save();
    return user;
  }

  async login(loginDto: LoginDto, res: Response, rememberMe: boolean) {
    try {
      const { email, password } = loginDto;

      const user = await this.validateUser(email, password);

      const payload = {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      if (!user.isEmailVerified) {
        throw new Error(
          'Konto nie zostało zweryfikowane. Zweryfikuj konto, żeby się zalogować',
        );
      }

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d'
      })

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('auth', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
        sameSite: 'strict',
      });

      res.cookie('refresh-token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
        sameSite: 'strict',
      });

      return res.json({ access_token: accessToken, RefreshToken: refreshToken});  
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Błąd logowania');
    }
  }

 
 
  async refreshAccessToken(refreshToken: string, res: Response): Promise<void> {
    try {
 
      const decoded = this.jwtService.verify(refreshToken, { secret: process.env.SECRETKEY});
  
      const user = await this.userModel.findById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('Nie znaleziono użytkownika');
      }
 
      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Konto nie jest zweryfikowane');
      }
  
 
      const payload = {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      };
  
      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });
  
      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });
 
      res.cookie('auth', newAccessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
        sameSite: 'strict',
      });
  
      res.cookie('refresh-token', newRefreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });
  
      res.json({ access_token: newAccessToken, refresh_token: newRefreshToken });
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new UnauthorizedException('Nieprawidłowy lub wygasły refresh token');
    }
  }
  

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('Nie znaleziono użytkownika');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Nie prawidłowe hasło');
      }

      return user;
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }

  async confirmEmail(token: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(token); //Rozkodowanie tokena
      const user = await this.userModel.findById(decoded._id); //Wyszukiwanie użytkownika po id

      if (!user) {
        throw new Error('Użytkownik nie istnieje');
      }

      if (user.isEmailVerified) {
        return 'Konto jest już aktywowane';
      }

      user.isEmailVerified = true;
      await user.save();

      return 'Konto zostało zweryfikowane pomyślnie!';
    } catch (error) {
      console.log('Błąd weryfikacji', error);
      throw new error('Nieprawidłowy lub wygasły token weryfikacyjny');
    }
  }

  async validateUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Nie znaleziono użytkownika');
    }
    return user;
  }

  async requestPassword(dto: RequestResetPasswordDto): Promise<String> {
    const { email } = dto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException(
        'Nie znaleziono użytkownika z podanym adresem email',
      );
    }

    const resetToken = this.jwtService.sign(
      { _id: user._id },
      { expiresIn: '1h' },
    ); //Token zawiera id użytkownika, żeby sprawdził który użytkownik dokonał akcji. Przypisuje token do konkretnego użytkownika
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600 * 1000);
    await user.save();

    const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
    await EmailService.sendPasswordResetEmail(email, resetLink, user.firstName);

    return 'Link do resetowania hasła został wysłany na podany e-mail';
  }

  async resetPassword(dto: ResetPasswordDto): Promise<string> {
    const { token, newPassword } = dto;

    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Nieprawdiłowy lub wygasły token');
    }

    const user = await this.userModel.findOne({
      _id: decoded._id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Brak użytkownika');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return 'Hasło zostało pomyslnie zresetowane';
  }
}
