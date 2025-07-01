import {
  CompleteMultipartUploadCommandOutput,
  CopyObjectCommand,
  CopyObjectCommandInput,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import * as path from 'path';
import {
  IGenerateS3KeyParams,
  IGenerateCopiedS3KeyParams,
  IUploadS3ToFileStreamParams,
  IUploadS3ToFileLinkParams,
  IDeleteFileFromS3Params,
  ICopyFileFromS3Params,
} from '../interface/s3-upload.interface';

export class S3Service {
  protected readonly s3Client: S3Client;
  protected readonly s3BucketName: string;

  constructor() {
    let s3ClientParams: S3ClientConfig = { region: 'ap-northeast-2' };
    if (process.env.ENV === 'dev') {
      s3ClientParams = {
        ...s3ClientParams,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      };
    }

    this.s3Client = new S3Client(s3ClientParams);
    this.s3BucketName = process.env.S3_BUCKET_NAME!;
  }

  /**
   * S3 키 생성
   * @param fileUploadType 파일 업로드 타입
   * @param fileUploadSubType 파일 업로드 서브 타입
   * @param fileExtension 파일 확장자
   * @returns S3 키
   */
  protected generateS3Key({
    fileUploadType,
    fileUploadSubType,
    entityId,
    fileExtension,
  }: IGenerateS3KeyParams) {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const fileName = crypto.randomUUID();
    const s3NameSpace: string = `${fileUploadType}${entityId ? `/${entityId}` : ''}${fileUploadSubType ? `/${fileUploadSubType}` : ''}`;
    return `${s3NameSpace}/${today}_${fileName}${fileExtension ?? ''}`.toLowerCase();
  }

  /**
   * 복사된 S3 키 생성
   * @param sourceS3Key 원본 S3 키˜
   * @param fileUploadType 파일 업로드 타입
   * @param entityId 엔티티 ID
   * @returns 복사된 S3 키
   */
  protected generateCopiedS3Key({
    sourceS3Key,
    fileUploadType,
    fileUploadSubType,
    entityId,
  }: IGenerateCopiedS3KeyParams) {
    const fileExtension = path.extname(sourceS3Key);
    return this.generateS3Key({
      fileUploadType,
      fileUploadSubType,
      entityId,
      fileExtension,
    });
  }

  /**
   * S3 파일 가져오기
   * @param s3Key S3 키
   * @returns 파일 스트림
   */
  protected async getFileFromS3({ s3Key }: { s3Key: string }) {
    const getParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
    };
    return await this.s3Client.send(new GetObjectCommand(getParams));
  }

  /**
   * S3 파일 업로드
   * @param fileStream 파일 스트림
   * @param entityId 엔티티 ID
   * @param fileUploadType 파일 업로드 타입
   * @param fileUploadSubType 파일 업로드 서브 타입
   * @returns 업로드 결과
   */
  protected async uploadS3ToFileStream({
    fileStream,
    fileUploadType,
    fileUploadSubType,
    entityId,
  }: IUploadS3ToFileStreamParams): Promise<CompleteMultipartUploadCommandOutput> {
    const fileExtension = path.extname(fileStream.originalname);
    const s3Key = this.generateS3Key({
      fileUploadType,
      fileUploadSubType,
      entityId,
      fileExtension,
    });

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
      Body: fileStream.buffer,
      ContentType: fileStream.mimetype,
    };

    return await new Upload({
      client: this.s3Client,
      params: uploadParams,
    }).done();
  }

  /**
   * 파일 링크로 파일 업로드
   * @param sourceFileLink 파일 링크
   * @param targetS3Key 대상 S3 키
   * @returns 업로드 결과
   */
  protected async uploadS3ToFileLink({
    sourceFileLink,
    targetS3Key,
  }: IUploadS3ToFileLinkParams) {
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: targetS3Key,
      Body: await fetch(sourceFileLink).then((res) => res.blob()),
    };

    return await new Upload({
      client: this.s3Client,
      params: uploadParams,
    }).done();
  }

  /**
   * S3 파일 삭제
   * @param s3Key S3 키
   */
  protected async deleteFileFromS3({ s3Key }: IDeleteFileFromS3Params) {
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
    };

    await this.s3Client.send(new DeleteObjectCommand(deleteParams));
  }

  /**
   * 파일 복사
   *
   * @deprecated
   * @error AccessDenied 20250616 11:00
   * @todo AccessDenied 해결 후 사용
   * @param sourceS3Key 원본 S3 키
   * @param targetS3Key 대상 S3 키
   */
  protected async copyFileFromS3({
    sourceS3Key,
    targetS3Key,
  }: ICopyFileFromS3Params) {
    const copyParams: CopyObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME,
      CopySource: sourceS3Key,
      Key: targetS3Key,

      MetadataDirective: 'COPY',
    };

    await this.s3Client.send(new CopyObjectCommand(copyParams));
  }
}
