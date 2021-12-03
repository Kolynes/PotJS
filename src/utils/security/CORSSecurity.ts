import { HttpRequest } from "../../request";
import { HttpBaseResponse, HttpResponse } from "../../response";
import { IMiddleware, IMiddlewareService, EServices, RequestResolver, EHttpMethods } from "../../types";
import ServiceProvider from "../services/ServiceProvider";



export default class CORSSecurity implements IMiddleware {
  private headers: string = "";
  private methods: string = "";
  private _maxAge: number = 0;
  private origin: string = "";

  constructor() {
    const middlewareService = ServiceProvider.getInstance().getService<IMiddlewareService>(EServices.middleware);
    middlewareService.addMiddleware(this);
  }

  allowedHeaders(headers: string): CORSSecurity {
    this.headers = headers;
    return this;
  }

  allowedMethods(methods: string): CORSSecurity {
    this.methods = methods;
    return this;
  }

  maxAge(seconds: number): CORSSecurity {
    this._maxAge = seconds;
    return this;
  }

  allowedOrigin(origin: string): CORSSecurity {
    this.origin = origin;
    return this;
  }


  async handle(request: HttpRequest, next: RequestResolver): Promise<HttpBaseResponse> {
    if(request.method == EHttpMethods.options) {
      console.log(this);
      return new HttpResponse(
        200, 
        undefined, 
        {
          "Access-Control-Allow-Origin": this.origin,
          "Access-Control-Allow-Methods": this.methods,
          "Access-Control-Max-Age": this._maxAge,
          "Access-Control-Allow-Headers": this.headers
        }
      );
    } else {
      return next(request);
    }
  }
}