import { UserRole } from 'src/domain/auth/enums/user-role.enum';

export type UserPayload = {
  id: string;
  role: UserRole;
  tokenType: string;
  iat: number;
  exp: number;
};
