import { HttpRequest } from "../../request";
import { HttpBaseResponse, HttpResponse } from "../../response";
import { RouteDecorator, RouteMethod } from "../../types";

export enum EContentTypes {
  multipart = "multipart/form-data",
  text = "text/plain",
  urlencoded = "application/x-www-form-urlencoded",
  json = "application/json"
}

export function ensureContentType(contentType: EContentTypes | string): RouteDecorator {
  return (target, route): RouteMethod => {
    return async (request: HttpRequest, ...args: string[]): Promise<HttpBaseResponse> => {
      if(request.headers["content-type"] && request.headers["content-type"].startsWith(contentType))
        return route.bind(target)(request, ...args);
      else return new HttpResponse(400, "invalid content type");
    }
  }
}