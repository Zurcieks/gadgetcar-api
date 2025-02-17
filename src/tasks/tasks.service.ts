import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/User.schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Cron('0 0 * * *')
  async deleteUnVerifiedAccount() {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 1); // Usuwanie kont niezweryfikowanych po 24 godzinach

    const result = await this.userModel.deleteMany({
      isEmailVerified: false,
      createdAt: { $lt: expirationDate },
    });

    console.log(`Usunięto ${result.deletedCount} niepotwierdzonych kont.`);
  }
}
