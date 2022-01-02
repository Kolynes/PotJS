import AuthMiddleware from "./AuthMiddleware";
import authenticator from "./authenticator";
import { RouteMethod } from "../types";
import { HttpRequest } from "../request";
import { HttpBaseResponse, HttpResponse } from "../response";


function ensureSignedIn(target: object, route: RouteMethod): RouteMethod {
  return async (request: HttpRequest, ...args: any[]): Promise<HttpBaseResponse> => {
    if(request.user !== undefined)
      return route.bind(target)(request, ...args);
    else return new HttpResponse(401, "You are unauthorized to make this request")
  }
}

export { authenticator, ensureSignedIn }

export default AuthMiddleware;