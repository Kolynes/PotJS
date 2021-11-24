import { IMiddleware, IMiddlewareService, RequestResolver } from "../middleware/types";
import HttpRequest from "../request/HttpRequest"
import HttpResponse from "../response/HttpBaseResponse"
import Service from "../utils/services/Service";
import { IController } from "./types";

export default class ControllerMiddlewareService extends Service implements IMiddlewareService {
  protected middleware: IMiddleware[] = [];

  protected getNext(
    index: number, 
    controller: IController, 
    route: string, 
    params: any[]
  ): RequestResolver {
    return async (request: HttpRequest) => await this.handle(
      request, 
      index, 
      controller, 
      route, 
      params
    );
  }
  
  handle(
    request: HttpRequest, 
    index: number, 
    controller: IController, 
    route: string, 
    params: any[]
  ): Promise<HttpResponse> {
    if(this.middleware.length == 0)
      return controller.routeToMethod(request, route, params)
    else if(index + 1 == this.middleware.length)
      return this.middleware[index].handle(
        request, 
        request => controller.routeToMethod(request, route, params)
      );
    else return this.middleware[index].handle(request, this.getNext(index + 1, controller, route, params))
  }

  addMiddleware(middleware: IMiddleware) {
    this.middleware.push(middleware);
  }
}