import { CookieOptions } from 'express';

interface IResponseHeader {
  [key: string]: string;
}

interface IResponseCookie {
  [key: string]: { val: string; cookieOptions: CookieOptions };
}

interface IResponseBody {
  [key: string]: any;
}

interface IResponse {
  headers: IResponseHeader | null;
  cookie: IResponseCookie | null;
  body: IResponseBody | null;
}

export class ResponseEntity implements IResponse {
  constructor(
    public headers: IResponseHeader | null = null,
    public cookie: IResponseCookie | null = null,
    public body: IResponseBody | null = null,
  ) {}

  static of(
    headers: IResponseHeader | null = null,
    cookie: IResponseCookie | null = null,
    body: IResponseBody | null = null,
  ): ResponseEntity {
    return new ResponseEntity(headers, cookie, body);
  }
}
