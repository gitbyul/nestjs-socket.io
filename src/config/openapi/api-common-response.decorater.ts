import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiCommonResponse = (options: {
  includeAuth?: boolean;
  includeValidation?: boolean;
}) => {
  const decorators: MethodDecorator[] = [];
  if (options.includeAuth) {
    decorators.push(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '인증 실패(Unauthorized)',
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '권한 없음(Forbidden)',
      }),
    );
  }

  if (options.includeValidation) {
    decorators.push(
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: '잘못된 요청(Bad Request)',
      }),
    );
  }

  decorators.push(
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: '리소스를 찾을 수 없습니다.(Not Found)',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: '서버 내부 오류(Internal Server Error)',
    }),
  );

  return applyDecorators(...decorators);
};
