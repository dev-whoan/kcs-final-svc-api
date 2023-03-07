import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { RedisManagerModule } from '../redis-manager/redis-manager.module';
import { FileServerController } from './file-server.controller';
import { FileInfoRepository } from './data/file.repository';
import { FileInfo, FileInfoSchema } from './data/file-info.schema';
import { FileServerService } from './file-server.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    MongooseModule.forFeature([
      { name: FileInfo.name, schema: FileInfoSchema },
    ]),
    ConfigModule.forRoot(),
    RedisManagerModule,
  ],
  controllers: [FileServerController],
  providers: [FileServerService, FileInfoRepository],
  exports: [FileServerService, FileInfoRepository],
})
export class FileServerModule {}
