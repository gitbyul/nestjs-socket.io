import { Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileUploadType } from '../enums/file-upload.enums';

@Injectable()
export class ChatS3Service extends S3Service {
  constructor() {
    super();
  }

  /**
   * 채팅 파일 업로드
   * @param fileStream 파일 스트림
   * @param senderId 발신자 ID
   * @returns 업로드 결과
   */
  async uploadFileToS3WithFileTypeChat(
    fileStream: Express.Multer.File,
    senderId: string,
  ) {
    return await this.uploadS3ToFileStream({
      fileStream,
      fileUploadType: FileUploadType.CHAT,
      entityId: senderId,
    });
  }
  /**
   * {
   *   '$metadata': {
   *     httpStatusCode: 200,
   *     requestId: 'XYY7THWMMBKHCXJC',
   *     extendedRequestId: 'LI8yL0zKw4Sk66J21xrcRTjz8rTlMoRoMXIY7n7Sk1bByprXNi5q7KiOX8cit57TFN5sXtRZDnI=',
   *     cfId: undefined,
   *     attempts: 1,
   *     totalRetryDelay: 0
   *   },
   *   ETag: '"bc9bb7196b28784b3f6c7182ab2161b3"',
   *   ChecksumCRC32: 'uE3OcA==',
   *   ChecksumType: 'FULL_OBJECT',
   *   ServerSideEncryption: 'AES256',
   *   Bucket: 'instatoon-bucket',
   *   Key: 'chat/57541bef-91f0-43d9-9fbe-884150bd7f54/20250701_3ae636a8-aacb-4ff3-a9d4-fe2fa68a6a9d.webp',
   *   Location: 'https://instatoon-bucket.s3.ap-northeast-2.amazonaws.com/chat/57541bef-91f0-43d9-9fbe-884150bd7f54/20250701_3ae636a8-aacb-4ff3-a9d4-fe2fa68a6a9d.webp'
   * }
   */
}
