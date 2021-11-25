import HttpRequest from "../request/HttpRequest";
import HttpResponse from "../response/HttpBaseResponse";
import { IBasicSettings } from "../types";
import Service from "../utils/services/Service";

export type RequestResolver = (request: HttpRequest) => Promise<HttpResponse>;

export interface IMiddleware {
  handle(request: HttpRequest, next: RequestResolver): Promise<HttpResponse>;
}

export interface IMiddlewareService extends Service {
  handle(request: HttpRequest, index: number, ...params: any[]): Promise<HttpResponse>;
  addMiddleware(middleware: IMiddleware): void;
}

