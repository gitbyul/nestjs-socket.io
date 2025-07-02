import { ApiProperty } from '@nestjs/swagger';
import { ConnectionStatus } from '../../enums/connection-state.enum';

export class ConnectionEstablishedResponseDto {
  @ApiProperty({
    description: '유저 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: '연결 상태',
    example: ConnectionStatus.CONNECTED,
  })
  status: ConnectionStatus.CONNECTED;

  @ApiProperty({
    description: '타임스탬프',
    example: new Date(),
  })
  timestamp: Date;
}
