import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { ConfigModule } from '@nestjs/config';
import { TasksService } from './tasks/tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
 
 

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }), 
    MongooseModule.forRoot('mongodb://localhost:27017/GadgetCar'),
    AuthModule,
    UserModule,
    ProductModule,
    
  ],
  controllers: [AuthController, UserController],
  providers: [UserService, TasksService],
})
export class AppModule {}
