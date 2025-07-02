import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { LogModule } from 'src/config/log/log.module';
import { UploadService } from './service/upload.service';
import { ChatS3Service } from './service/chat-s3.service';
import { AuthModule } from '../auth/auth.module';
import { FileService } from './service/file.service';
import { Files } from './entity/Files.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [LogModule, AuthModule, TypeOrmModule.forFeature([Files])],
  providers: [UploadService, ChatS3Service, FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
