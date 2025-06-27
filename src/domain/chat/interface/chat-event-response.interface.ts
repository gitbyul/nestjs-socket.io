import { EventErrorCode } from '../enums/chat-error-code.enum';
import { EventPayloadMap } from '../type/event-payload.map';

export interface IChatEventResponse<T extends keyof EventPayloadMap> {
  success: boolean;
  event: T;
  data?: EventPayloadMap[T];
  error?: {
    code: EventErrorCode;
    message: string;
  };
  timestamp: Date;
}
