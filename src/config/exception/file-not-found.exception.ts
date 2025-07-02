import { NotFoundException } from '@nestjs/common';

export class FileNotFoundException extends NotFoundException {
  constructor(fileId: string) {
    super(`[FileNotFoundException] File not found: ${fileId}`);
  }
}
