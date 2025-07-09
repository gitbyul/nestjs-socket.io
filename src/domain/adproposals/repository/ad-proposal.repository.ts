import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdProposals } from '../entity/AdProposals.entity';

@Injectable()
export class AdProposalRepository {
  constructor(
    @InjectRepository(AdProposals)
    private adProposalRepository: Repository<AdProposals>,
  ) {}

  findByAdProposalId(adProposalId: string) {
    return this.adProposalRepository.findOne({
      where: {
        id: adProposalId,
      },
    });
  }
}
