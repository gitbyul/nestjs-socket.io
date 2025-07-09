import { forwardRef, Module } from '@nestjs/common';
import { AdProposalRepository } from './repository/ad-proposal.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdProposals } from './entity/AdProposals.entity';
import { AdProposalService } from './service/ad-proposal.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdProposals]),
    forwardRef(() => ChatModule),
  ],
  controllers: [],
  providers: [AdProposalRepository, AdProposalService],
  exports: [AdProposalRepository, AdProposalService],
})
export class AdProposalsModule {}
