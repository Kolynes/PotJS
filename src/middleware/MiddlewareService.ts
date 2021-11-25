import { IControllerService } from "../controllers/types";
import HttpRequest from "../request/HttpRequest";
import HttpResponse from "../response/HttpBaseResponse";
import { EServices } from "../types";
import Service, { serviceClass } from "../utils/services/Service";
import { service } from "../utils/services/ServiceProvider";
import { IMiddleware, IMiddlewareService, IMiddlewareSettings, RequestResolver } from "./types";
import path from "path";

@serviceClass(EServices.middleware)
class MiddlewareService extends Service implements IMiddlewareService {
  protected middleware: IMiddleware[] = [];

  @service(EServices.controllers)
  private controllerService!: IControllerService;

  @service(EServices.settings)
  private settings!: IMiddlewareSettings;

  async initState() {
    let middlewareModules: string[] = this.settings.middleware || [];
    if(middlewareModules.length > 0)
      for(let module of middlewareModules)
        await import(path.resolve(this.settings.sourceDirectory, module));
    super.initState();
  }

  protected getNext(index: number, ...params: any[]): RequestResolver {
    return async (request: HttpRequest) => await this.handle(request, index, ...params);
  }

  handle(request: HttpRequest, index: number, ...params: any[]): Promise<HttpResponse> {
    if(this.middleware.length == 0)
      return this.controllerService.routeToController(request);
    else if(index + 1 == this.middleware.length)
      return this.middleware[index].handle(request, request => this.controllerService.routeToController(request));
    else return this.middleware[index].handle(request, this.getNext(index + 1, ...params));
  }

  addMiddleware(middleware: IMiddleware) {
    this.middleware.push(middleware);
  }
}