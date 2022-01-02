import { IMiddleware } from "../middleware/types";
import HttpRequest from "../request/HttpRequest";
import HttpResponse from "../response/HttpBaseResponse";
import { EHttpMethods, EServices, IIndexable } from "../types";
import ServiceProvider from "../utils/services/ServiceProvider";
import ControllerMiddlewareService from "./ControllerMiddlewareService";
import { IController, IControllerService, RouteDecorator } from "./types";

export function controller(path: string, middleware?: IMiddleware[]): ClassDecorator {
  return (target: any) => {
    let controllerService = ServiceProvider.getInstance().getService<IControllerService>(EServices.controllers);
    controllerService.addController(new target(
      path,
      middleware
    ));
  }
}

export function route(path: string = "", method: EHttpMethods = EHttpMethods.get, decorators: RouteDecorator[] = []): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor) => {
    let call = target[propertyKey].bind(target);
    for(let decorator of decorators)
      call = decorator(target, call);
    Object.defineProperty(target, `Route${propertyKey as String}`, { value: { call, path, method } })
    target[propertyKey] = undefined;
  }
}

export function Get(path: string = "", decorators: RouteDecorator[] = []): MethodDecorator {
  return route(path, EHttpMethods.get, decorators);
}

export function Post(path: string = "", decorators: RouteDecorator[] = []): MethodDecorator {
  return route(path, EHttpMethods.post, decorators);
}

export function Put(path: string = "", decorators: RouteDecorator[] = []): MethodDecorator {
  return route(path, EHttpMethods.put, decorators);
}

export function Delete(path: string = "", decorators: RouteDecorator[] = []): MethodDecorator {
  return route(path, EHttpMethods.delete, decorators);
}

export function Patch(path: string = "", decorators: RouteDecorator[] = []): MethodDecorator {
  return route(path, EHttpMethods.patch, decorators);
}

export function Connect(path: string = "", decorators: RouteDecorator[] = []): MethodDecorator {
  return route(path, EHttpMethods.connect, decorators);
}

export function Options(path: string = "", decorators: RouteDecorator[] = []): MethodDecorator {
  return route(path, EHttpMethods.options, decorators);
}

export function Trace(path: string = "", decorators: RouteDecorator[] = []): MethodDecorator {
  return route(path, EHttpMethods.trace, decorators);
}

export default class Controller implements IController {
  readonly routes: IIndexable<Map<EHttpMethods, Function>> = {};
  readonly middlewareService = new ControllerMiddlewareService();

  constructor(
    private basePath: string,
    middleware: IMiddleware[] = []
  ) {
    for (var middlewareInstance of middleware)
      this.middlewareService.addMiddleware(middlewareInstance)
    let descriptors = Object.getOwnPropertyDescriptors(this.constructor.prototype);
    for (var prop in descriptors) {
      if (prop.startsWith("Route")) {
        this.registerRoute(
          descriptors[prop].value.path,
          descriptors[prop].value.method,
          descriptors[prop].value.call
        );
      }
    }
  }

  registerRoute(path: string, method: EHttpMethods, instanceMethod: Function) {
    if (this.routes[this.basePath + path] == null)
    this.routes[this.basePath + path] = new Map();
    else if (this.routes[this.basePath + path].has(method))
    throw (`Error registering route: ${method} ${this.basePath + path} has been registered before`)
    this.routes[this.basePath + path].set(method, instanceMethod)
  }

  async routeToMethod(request: HttpRequest, route: string, params: any[]): Promise<HttpResponse> {
    return await this.routes[route].get(request.method)!(request, ...params);
  }
}