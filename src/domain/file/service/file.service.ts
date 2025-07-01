import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatFileService } from './chat-file.service';
import { UserService } from 'src/domain/user/service/user.service';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

@Injectable()
export class FileService {
  constructor(
    private readonly chatFileService: ChatFileService,
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

    return this.chatFileService.uploadFileToS3WithFileTypeChat(file, sender.id);
  }
}
