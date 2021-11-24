import { IMiddlewareService } from "../middleware/types";
import HttpRequest from "../request/HttpRequest";
import HttpResponse from "../response/HttpBaseResponse";
import { EHttpMethods, IIndexable } from "../types";
import Service from "../utils/services/Service";

export interface IController {
  readonly routes: IIndexable<Map<EHttpMethods, Function>>;
  readonly middlewareService: IMiddlewareService,
  routeToMethod(request: HttpRequest, route: string, params: any[]): Promise<HttpResponse>;
}

export interface IControllerService extends Service {
  readonly controllers: IController[];
  addController(controller: IController): void;
  routeToController(request: HttpRequest): Promise<HttpResponse>;
}

export interface IControllerSettings {
  controllers: string[];
}