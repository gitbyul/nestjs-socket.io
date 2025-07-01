import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResponseDto {
  @ApiProperty({
    description: '업로드된 파일의 키',
    example: 'uploads/2024/01/abc123.jpg',
  })
  key: string | undefined;

  @ApiProperty({
    description: '업로드된 파일의 URL',
    example: 'https://s3.amazonaws.com/bucket/uploads/2024/01/abc123.jpg',
  })
  location: string | undefined;

  constructor(key: string | undefined, location: string | undefined) {
    this.key = key;
    this.location = location;
  }

  static of(key: string | undefined, location: string | undefined) {
    return new FileUploadResponseDto(key, location);
  }
}
