import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Advertisers } from '../entity/Advertisers.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdvertiserService {
  constructor(
    @InjectRepository(Advertisers)
    private advertiserRepository: Repository<Advertisers>,
  ) {}

  async existsById(id: string) {
    return await this.advertiserRepository.exists({
      where: { id },
    });
  }

  async getAdvertiserById(id: string) {
    return this.advertiserRepository.findOne({ where: { id } });
  }
  async getAdvertiserByIdWithTransaction(manager: EntityManager, id: string) {
    return await manager.findOne(Advertisers, { where: { id } });
  }
}
