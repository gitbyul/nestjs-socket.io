import {
  FileUploadSubType,
  FileUploadType,
} from '../enums/file-upload-type.enums';

export interface IGenerateS3KeyParams {
  fileUploadType: FileUploadType;
  fileUploadSubType?: FileUploadSubType;
  entityId?: string;
  fileExtension?: string;
}

export interface IGenerateCopiedS3KeyParams {
  sourceS3Key: string;
  fileUploadType: FileUploadType;
  fileUploadSubType?: FileUploadSubType;
  entityId: string;
}

export interface IUploadS3ToFileStreamParams {
  fileStream: Express.Multer.File;
  fileUploadType: FileUploadType;
  fileUploadSubType?: FileUploadSubType;
  entityId?: string;
}

export interface IUploadS3ToFileLinkParams {
  sourceFileLink: string;
  targetS3Key: string;
}

export interface IDeleteFileFromS3Params {
  s3Key: string;
}

export interface ICopyFileFromS3Params {
  sourceS3Key: string;
  targetS3Key: string;
}
