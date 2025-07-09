import { Module } from '@nestjs/common';
import { AdProposalRepository } from './repository/ad-proposal.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdProposals } from './entity/AdProposals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdProposals])],
  controllers: [],
  providers: [AdProposalRepository],
  exports: [AdProposalRepository],
})
export class AdProposalsModule {}
