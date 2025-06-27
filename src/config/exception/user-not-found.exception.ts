import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(userId: string, userRole?: string) {
    const roleInfo = userRole ? ` (${userRole})` : '';
    super(`[UserNotFoundException] User not found: ${userId}${roleInfo}`);
  }
}
