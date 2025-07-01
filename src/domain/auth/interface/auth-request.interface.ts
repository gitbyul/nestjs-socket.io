import { Request } from 'express';
import { UserPayload } from 'src/config/type/user-payload.type';

export interface AuthRequest extends Request {
  user: UserPayload;
}
