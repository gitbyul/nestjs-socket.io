import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatS3Service } from './chat-s3.service';
import { UserService } from 'src/domain/user/service/user.service';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { Files } from '../entity/Files.entity';
import { FileRelatedTable } from '../enums/file-releated-table.enums';
import { FileCode } from '../enums/file-upload-code.enum';
import { FileService } from './file.service';
import { FileUploadResponseDto } from '../response/file-upload.response';

@Injectable()
export class UploadService {
  constructor(
    private readonly chatS3Service: ChatS3Service,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  /**
   * 채팅 파일 업로드
   * @param file 업로드 파일
   * @param sender 업로드 유저 정보
   * @returns 업로드 파일 정보
   */
  async chatFileUploadFile(
    file: Express.Multer.File,
    sender: { id: string; type: UserRole },
  ): Promise<FileUploadResponseDto> {
    // Sender 유저 조회
    const user = await this.userService.getUserById(sender.id, sender.type);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // S3 업로드
    const result = await this.chatS3Service.uploadFileToS3WithFileTypeChat(
      file,
      sender.id,
    );

    // 파일 엔티티 생성 및 저장
    const fileEntity = Files.create({
      originalFilename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: result.Key as string,
      url: result.Location as string,
      relatedTable: FileRelatedTable.CHAT,
      relatedCode: FileCode.CHAT_FILE,
      relatedId: sender.id,
    });
    const savedFile = await this.fileService.save(fileEntity);

    return {
      fileId: savedFile.id,
      fileUrl: savedFile.url,
    };
  }
}
