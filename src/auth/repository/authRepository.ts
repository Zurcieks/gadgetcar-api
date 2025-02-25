import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schemas/User.schema";

@Injectable()
export  class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({email});
  }

  async findByRefreshToken(refreshToken: string): Promise<User> {
    return this.userModel.findOne({refreshToken, refreshTokenExpires: {$gt: new Date()}});
  }

  async save(user: User): Promise<User> {
    return user.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
 
}