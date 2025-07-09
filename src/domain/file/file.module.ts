import { forwardRef, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { LogModule } from 'src/config/log/log.module';
import { FileService } from './service/file.service';
import { ChatS3Service } from './service/chat-s3.service';
import { AuthModule } from '../auth/auth.module';
import { FileRepository } from './repository/file.repository';
import { Files } from './entity/Files.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    LogModule,
    AuthModule,
    forwardRef(() => ChatModule),
    TypeOrmModule.forFeature([Files]),
  ],
  providers: [FileService, ChatS3Service, FileRepository],
  controllers: [FileController],
  exports: [FileRepository, FileService],
})
export class FileModule {}
