import HttpRequest from "../request/HttpRequest";
import HttpBadRequestResponse from "../response/HttpBadRequestResponse";
import HttpNotFoundResponse from "../response/HttpNotFoundResponse";
import HttpResponse from "../response/HttpBaseResponse";
import Service, { serviceClass } from "../utils/services/Service";
import { IController, IControllerService } from "./types";
import { EServices } from "../types";

@serviceClass(EServices.controllers)
class ControllerService extends Service implements IControllerService {
  readonly controllers: IController[] = [];
  private readonly parametizedFragmentRegExp = 
    /\/*(\b\w+\b)|(?:<([^0-9\/][0-9a-zA-Z]*):(path|boolean|int|float|string)>)\/*/g;

  addController(controller: IController) {
    this.controllers.push(controller);
  }

  matchPath(path1: string, path2: string): false | any[] {
    let newPath = [];
    let parameters: Function[] = [];
    while (true) {
      let result = this.parametizedFragmentRegExp.exec(path1)!
      if(result == null) break;
      else {
        let [ 
          matchedString, 
          constantFragment, 
          variableFragmentName, 
          variableFragmentType 
        ] = result;
        if(variableFragmentName !== undefined)
          switch(variableFragmentType) {
            case "boolean":
              newPath.push("(true|false)");
              parameters.push((value: any) => value == "true");
              break;
            case "string":
              newPath.push("([^/.]+)");
              parameters.push((value: any) => value);
              break;
            case "float":
              newPath.push("(\-{0,1}[0-9]+\.{0,1}[0-9]+(?:e\-{0,1}[0-9]+){0,1})");
              parameters.push((value: string) => parseFloat(value));
              break;
            case "int": 
              newPath.push("([0-9]+)");
              parameters.push((value: string) => parseInt(value));
              break;
            case "path":
              newPath.push("(.*)");
              parameters.push((value: any) => value);
              break;
            default:
              throw new Error(`unsupported parameter type '${variableFragmentType}'`);
          }
          else if (constantFragment !== undefined)
            newPath.push(constantFragment);
      }
    }
    let matcher = new RegExp("^/*" + newPath.join("/") + "/*$");
    if(matcher.test(path2))
      return matcher
        .exec(path2)!
        .slice(1, parameters.length + 1)
        .map((value, index) => parameters[index](value));
    return false;
  }

  async routeToController(request: HttpRequest): Promise<HttpResponse> {
    for (var controller of this.controllers) {
      for (var route in controller.routes) {
        let params = this.matchPath(route, request.url.pathname)
        if (params !== false)
          if (!controller.routes[route].has(request.method))
            return new HttpBadRequestResponse("Bad method");
          else return await controller.middlewareService.handle(request, 0, controller, route, params);
      }
    }
    return new HttpNotFoundResponse();
  }
}