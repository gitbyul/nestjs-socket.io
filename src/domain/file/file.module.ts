import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { LogModule } from 'src/config/log/log.module';
import { FileService } from './service/file.service';
import { ChatFileService } from './service/chat-file.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [LogModule, UserModule],
  providers: [FileService, ChatFileService],
  controllers: [FileController],
  exports: [],
})
export class FileModule {}
