import { Injectable } from '@nestjs/common';
import { Files } from '../entity/Files.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: Repository<Files>) {}

  async save(file: Files) {
    return await this.fileRepository.save(file);
  }
}
