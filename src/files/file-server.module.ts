import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { RedisManagerModule } from 'src/redis-manager/redis-manager.module';
import { FileServerController } from './controller/file-server.controller';
import { FilesRepository } from './data/file.repository';
import { Files, FilesSchema } from './data/file.schema';
import { FileServerService } from './service/file-server.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    MongooseModule.forFeature([{ name: Files.name, schema: FilesSchema }]),
    ConfigModule.forRoot(),
    RedisManagerModule,
  ],
  controllers: [FileServerController],
  providers: [FileServerService, FilesRepository],
  exports: [FileServerService, FilesRepository],
})
export class FileServerModule {}
