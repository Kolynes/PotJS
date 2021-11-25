import Controller from "../controllers";
import { EServices, IControllerService, IMiddlewareService } from "../types";
import ServiceProvider from "../utils/services/ServiceProvider";

export function middleware(applyTo?: typeof Controller[]): ClassDecorator {
  return (target: any) => {
    let middlewareService = ServiceProvider.getInstance().getService<IMiddlewareService>(EServices.middleware);
    let controllerService = ServiceProvider.getInstance().getService<IControllerService>(EServices.controllers);
    let targetObject = new target();
    if(applyTo != undefined) {
      for(var ControllerType of applyTo!)
        for(var controller of controllerService.controllers)
          if(controller instanceof ControllerType)
            controller.middlewareService.addMiddleware(targetObject)
    }
    else middlewareService.addMiddleware(targetObject);
  }
}