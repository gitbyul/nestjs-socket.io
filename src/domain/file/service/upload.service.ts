import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatS3Service } from './chat-s3.service';
import { UserService } from 'src/domain/user/service/user.service';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

@Injectable()
export class UploadService {
  constructor(
    private readonly chatS3Service: ChatS3Service,
    private readonly userService: UserService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    sender: { id: string; type: UserRole },
  ) {
    const user = await this.userService.getUserById(sender.id, sender.type);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = await this.chatS3Service.uploadFileToS3WithFileTypeChat(
      file,
      sender.id,
    );
    console.log('result : ', result);
    return result;
  }
}
