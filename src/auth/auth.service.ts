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
import * as crypto from 'crypto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from './service/email.service';
import { AuthRepository } from './repository/authRepository';
import { TokenService } from './service/token.service';
import { CookieService } from './service/cookie.service';

@Injectable()
export class AuthService {
  sendEmail: any;
  constructor(
    private jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,

    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(createUserDto: RegisterDto): Promise<User> {
    try {
      const { firstName, lastName, email, password } = createUserDto;
      const userExists = await this.authRepository.findByEmail(email);

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

      const verificationToken = this.tokenService.generateVerificationToken(
        newUser._id.toString(),
      );
      const verificationLink = `http://localhost:3000/autoryzacja/weryfikacja?token=${verificationToken}`;

      try {
        await EmailService.sendVerificationEmail(
          email,
          verificationLink,
          firstName,
        );
      } catch (emailError) {
        throw new Error('Nie udało się wysłać e-maila weryfikacyjnego');
      }

      await newUser.save();

      return newUser;
    } catch (error) {
      console.error('Błąd podczas rejestracji:', error);
      throw new BadRequestException(
        'Błąd podczas rejestracji użytkownika',
        error.message,
      );
    }
  }

  async login(loginDto: LoginDto, res: Response, rememberMe: boolean) {
    try {
      const { email, password } = loginDto;

      const user = await this.validateUser(email, password);

      if (!user.isEmailVerified) {
        throw new Error(
          'Konto nie zostało zweryfikowane. Zweryfikuj konto, żeby się zalogować',
        );
      }

      const { accessToken, refreshToken, refreshTokenExpires } =
        this.tokenService.generateTokens(
          user._id.toString(),
          user.email,
          user.role,
          rememberMe,
        );

      user.refreshTokenExpires = refreshTokenExpires;
      user.refreshToken = refreshToken;
      await user.save();

      this.cookieService.setAuthCookies(
        res,
        accessToken,
        refreshToken,
        rememberMe,
      );

      return res.json({
        access_token: accessToken,
        RefreshToken: refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw new BadRequestException('Błąd logowania');
    }
  }

  async refreshAccessToken(refreshToken: string, res: Response): Promise<void> {
    const user = await this.authRepository.findByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException(
        'Nieprawidłowy lub wygasły refresh token',
      );
    }
    const newAccessToken = this.tokenService.generateAccessToken(
      user._id.toString(),
      user.email,
      user.role,
    );
    await user.save();

    this.cookieService.setAuthCookies(res, newAccessToken, refreshToken, true);

    res.json({
      access_token: newAccessToken,
    });
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
      const user = await this.authRepository.findById(decoded._id); //Wyszukiwanie użytkownika po id

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
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        'Nie znaleziono użytkownika z podanym adresem email',
      );
    }
    const resetToken = this.tokenService.generateResetPasswordToken(
      user._id.toString(),
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600 * 1000);
    await user.save();

    const resetLink = `http://localhost:3000/autoryzacja/prosba?token=${resetToken}`;
    await EmailService.sendPasswordResetEmail(email, resetLink, user.firstName);

    return 'Link do resetowania hasła został wysłany na podany e-mail';
  }

  async resetPassword(dto: ResetPasswordDto): Promise<string> {
    const { token, newPassword } = dto;

    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Nieprawdiłowy lub wygasły token');
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
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    user.refreshToken = crypto.randomBytes(40).toString('hex');
    await user.save();

    return 'Hasło zostało pomyslnie zresetowane';
  }

  async logout(refreshToken: string, res: Response): Promise<void> {
    const user = await this.userModel.findOne({ refreshToken });

    if (!user) {
      throw new NotFoundException('Nie znaleziono użytkownika');
    }

    this.cookieService.DeleteCookies(res);
    user.refreshTokenExpires = null;
    user.refreshToken = null;
    await user.save();
  }
}
