import { forwardRef, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { LogModule } from 'src/config/log/log.module';
import { FileService } from './service/file.service';
import { ChatS3Service } from './service/chat-s3.service';
import { AuthModule } from '../auth/auth.module';
import { FileRepository } from './repository/file.repository';
import { Files } from './entity/Files.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { HttpAuthGuard } from '../auth/guard/http-auth.guard';
import { RbacGuard } from '../auth/guard/rbac.guard';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    LogModule,
    AuthModule,
    forwardRef(() => ChatModule),
    TypeOrmModule.forFeature([Files]),
  ],
  providers: [
    FileService,
    ChatS3Service,
    FileRepository,
    {
      provide: APP_GUARD,
      useClass: HttpAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RbacGuard,
    },
  ],
  controllers: [FileController],
  exports: [FileRepository],
})
export class FileModule {}
