import { SetMetadata } from '@nestjs/common';

export const VALIDATE_DTO_KEY = 'DTO';
export const ValidateDto = (dto: any) => SetMetadata(VALIDATE_DTO_KEY, dto);
