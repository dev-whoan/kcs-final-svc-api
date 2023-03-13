import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisManagerModule } from '../redis-manager/redis-manager.module';
import { UserController } from './user.controller';
import { UserRepository } from './data/user.repository';
import { UserService } from './user.service';
import { User, _UserSchema } from './data/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import Handlebars from 'handlebars';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisManagerModule,
    MongooseModule.forFeature([{ name: User.name, schema: _UserSchema }]),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
