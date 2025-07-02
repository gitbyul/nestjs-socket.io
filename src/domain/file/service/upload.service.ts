import { Injectable } from '@nestjs/common';
import { ChatS3Service } from './chat-s3.service';
import { FileService } from './file.service';
import { Files } from '../entity/Files.entity';

@Injectable()
export class UploadService {
  constructor(
    private readonly chatS3Service: ChatS3Service,
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
    dto: { chatRoomId: string },
  ): Promise<Files> {
    // S3 업로드
    const result = await this.chatS3Service.uploadFileToS3WithFileTypeChat(
      file,
      dto.chatRoomId,
    );

    // 파일 엔티티 생성 및 저장
    return await this.fileService.createChatMessageFile({
      originalFilename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: result.Key as string,
      url: result.Location as string,
    });
  }
}
