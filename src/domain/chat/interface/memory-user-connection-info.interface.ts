import { UserRole } from 'src/domain/auth/enums/user-role.enum';
import { ConnectionStatus } from '../enums/connection-state.enum';

export interface IMemoryUserConnectionInfo {
  // 사용자 식별 정보
  userId: string;
  socketId: string;
  userRole: UserRole;

  // 연결 시간 정보
  connectedAt: Date;
  lastActivityAt: Date;
  lastHeartbeatAt: Date;

  // 연결 상태
  status: ConnectionStatus;

  // 참여 정보
  joinedChatRooms: string[];
  currentChatRoom?: string;
}
