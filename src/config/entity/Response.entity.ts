import { CookieOptions } from 'express';

interface IResponseHeader {
  [key: string]: string;
}

interface IResponseCookie {
  [key: string]: { val: string; cookieOptions: CookieOptions };
}

interface IResponse<T = any> {
  headers: IResponseHeader | null;
  cookie: IResponseCookie | null;
  body: T | null;
}

export class ResponseEntity<T = any> implements IResponse {
  constructor(
    public headers: IResponseHeader | null = null,
    public cookie: IResponseCookie | null = null,
    public body: T | null = null,
  ) {}

  static success<T>(body: T): ResponseEntity<T> {
    return new ResponseEntity(null, null, body);
  }

  static error<T>(error: T): ResponseEntity<T> {
    return new ResponseEntity(null, null, error);
  }

  static withHeaders<T>(headers: IResponseHeader, body: T): ResponseEntity<T> {
    return new ResponseEntity(headers, null, body);
  }

  static withCookie<T>(cookie: IResponseCookie, body: T): ResponseEntity<T> {
    return new ResponseEntity(null, cookie, body);
  }

  static withHeadersAndCookie<T>(
    headers: IResponseHeader,
    cookie: IResponseCookie,
    body: T,
  ): ResponseEntity<T> {
    return new ResponseEntity(headers, cookie, body);
  }
}
