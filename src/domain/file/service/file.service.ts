import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatS3Service } from './chat-s3.service';
import { FileRepository } from '../repository/file.repository';
import { Files } from '../entity/Files.entity';
import { LogUtil } from 'src/config/log/log.util';
import { ChatMessageService } from 'src/domain/chat/servcie/chat-message.service';

@Injectable()
export class FileService {
  constructor(
    private readonly chatS3Service: ChatS3Service,
    private readonly fileService: FileRepository,
    @Inject(forwardRef(() => ChatMessageService))
    private readonly chatMessageService: ChatMessageService,
    private readonly logUtil: LogUtil,
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

  /**
   * 파일이 사용자의 채팅방에 속한 파일인지 검증합니다.
   * @param fileId 파일의 고유 ID
   * @param userId 요청 유저의 ID
   * @param chatRoomId 요청 채팅방의 ID
   * @throws NotFoundException 파일이 없거나 채팅방에 속하지 않은 경우
   */
  async validateFileBelongsToChatRoom(
    fileId: string,
    userId: string,
    chatRoomId: string,
  ): Promise<void> {
    // 파일 엔티티 조회
    const file = await this.fileService.getFileByFileId({ fileId });
    if (!file) {
      throw new NotFoundException(`[${fileId}] File not found`);
    }

    // 파일이 요청한 채팅방에 속하는지 확인
    if (file.relatedId !== chatRoomId) {
      this.logUtil.HttpError(
        new Error(
          `[${fileId}] File does not belong to chatRoomId: ${chatRoomId}`,
        ),
      );
      throw new NotFoundException(
        `[${fileId}] File does not belong to chatRoomId: ${chatRoomId}`,
      );
    }

    // 채팅방에 속한 메시지인지 검증
    const chatMessage = await this.chatMessageService.getChatMessage({
      chatRoomId,
      messageId: file.relatedId,
    });
    if (!chatMessage) {
      throw new NotFoundException(
        `[${fileId}] Chat message not found in chatRoomId: ${chatRoomId}`,
      );
    }
  }

  /**
   * 파일 ID를 기반으로 파일 엔티티와 S3에서 WebStream을 반환합니다.
   * @param fileId 파일의 고유 ID
   * @returns 파일 엔티티와 WebStream 객체
   */
  async getS3FileWithWebStreamAndFileEntity(fileId: string) {
    try {
      // 1. 파일 엔티티 조회
      const file = await this.fileService.getFileByFileId({ fileId });
      if (!file) {
        throw new NotFoundException(`[${fileId}] File not found`);
      }

      // 2. S3에서 파일 객체 다운로드
      const s3Object =
        await this.chatS3Service.downloadFileFromS3WithFileTypeChat(file.path);
      if (!s3Object) {
        throw new NotFoundException(`[${file.path}] S3 object not found`);
      }
      if (!s3Object.Body) {
        throw new NotFoundException(`[${file.path}] S3 object body not found`);
      }

      // 3. S3 객체의 Body를 WebStream으로 변환
      const webStream: ReadableStream = s3Object.Body.transformToWebStream();
      if (!webStream) {
        throw new NotFoundException(`[${file.path}] Web stream not found`);
      }

      // 4. 파일 엔티티와 WebStream 반환
      return {
        file,
        webStream,
      };
    } catch (error) {
      // 예외 발생 시 로그 기록 후 예외 재전파
      this.logUtil.HttpError(error);
      throw error;
    }
  }
}
