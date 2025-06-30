import { TokenType } from 'src/domain/auth/enums/token-type.enum';
import { UserRole } from 'src/domain/auth/enums/user-role.enum';

export type UserPayload = {
  id: string;
  role: UserRole;
  tokenType: TokenType;
  iat: number;
  exp: number;
};
