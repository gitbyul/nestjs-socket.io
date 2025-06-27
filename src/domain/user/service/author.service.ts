import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Author } from '../entity/Author.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async existsById(id: string) {
    return await this.authorRepository.exists({
      where: { id },
    });
  }

  async getAuthorById(id: string) {
    return this.authorRepository.findOne({ where: { id } });
  }
  async getAuthorByIdWithTransaction(manager: EntityManager, id: string) {
    return await manager.findOne(Author, { where: { id } });
  }
}
