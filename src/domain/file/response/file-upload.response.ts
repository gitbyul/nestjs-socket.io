import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResponseDto {
  @ApiProperty({
    description: '업로드된 파일의 키',
    example: '57541bef-91f0-43d9-9fbe-884150bd7f54',
  })
  fileId: string;

  @ApiProperty({
    description: '업로드된 파일의 URL',
    example: 'https://s3.amazonaws.com/bucket/uploads/2024/01/abc123.jpg',
  })
  fileUrl: string;
}
