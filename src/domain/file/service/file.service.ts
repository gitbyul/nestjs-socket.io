import { Injectable } from '@nestjs/common';
import { Files } from '../entity/Files.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Files)
    private readonly fileRepository: Repository<Files>,
  ) {}

  async save(file: Files) {
    return await this.fileRepository.save(file);
  }
}
