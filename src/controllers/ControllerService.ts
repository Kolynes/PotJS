import HttpRequest from "../request/HttpRequest";
import HttpBadRequestResponse from "../response/HttpBadRequestResponse";
import HttpNotFoundResponse from "../response/HttpNotFoundResponse";
import HttpResponse from "../response/HttpBaseResponse";
import HttpServerErrorResponse from "../response/HttpServerErrorResponse";
import Service, { serviceClass } from "../utils/services/Service";
import { IController, IControllerService } from "./types";
import { EServices } from "../types";

@serviceClass(EServices.controllers)
class ControllerService extends Service implements IControllerService {
  readonly controllers: IController[] = [];

  addController(controller: IController) {
    this.controllers.push(controller);
  }

  matchPath(path1: string, path2: string): false | any[] {
    const path1Fragments = this.getFragments(path1);
    const path2Fragments = this.getFragments(path2);
    const params = [];

    if(path1Fragments.length == path2Fragments.length) {
      for(let fragment in path1Fragments)
        if(path1Fragments[fragment].startsWith(":"))
          params.push(path2Fragments[fragment])
        else if(path1Fragments[fragment] != path2Fragments[fragment])
          return false;
      return params;
    }
    return false;
  }

  getFragments(path: string): string[] {
    let fragments = path.split("/")
    return fragments.filter(element => element.length > 0)
  }

  async routeToController(request: HttpRequest): Promise<HttpResponse> {
    for(var controller of this.controllers) {
      for(var route in controller.routes) {
        let params = this.matchPath(route, request.url.pathname)
        if(params !== false)
          try {
            if(!controller.routes[route].has(request.method))
              return new HttpBadRequestResponse("Bad method");
            else return await controller.middlewareService.handle(request, 0, controller, route, params)
          } catch(e) {
            return new HttpServerErrorResponse(String(e));
          }
      }
    }
    return new HttpNotFoundResponse();
  }
}