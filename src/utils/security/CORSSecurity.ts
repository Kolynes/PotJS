import { ServerResponse } from "http";
import Server from "../../core/Server";
import { HttpRequest } from "../../request";
import { HttpBaseResponse, HttpResponse } from "../../response";
import { IMiddleware, IMiddlewareService, EServices, RequestResolver, EHttpMethods } from "../../types";
import ServiceProvider from "../services/ServiceProvider";

export default class CORSSecurity implements IMiddleware {
  private headers: string = "";
  private methods: string = "";
  private _maxAge: number = 0;
  private origin: string = "";
  private _exposedHeaders: string = "";

  constructor() {
    const middlewareService = ServiceProvider.getInstance().getService<IMiddlewareService>(EServices.middleware);
    middlewareService.addMiddleware(this);
    Server.responseWriter = this.responseWriter.bind(this);
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

  exposedHeaders(headers: string): CORSSecurity {
    this._exposedHeaders = headers;
    return this;
  }

  get accessControlHeaders() {
    return {
      "Access-Control-Allow-Origin": this.origin,
      "Access-Control-Allow-Methods": this.methods,
      "Access-Control-Max-Age": this._maxAge.toString(),
      "Access-Control-Allow-Headers": this.headers,
      "Access-Control-Expose-Headers": this._exposedHeaders
    };
  }

  async handle(request: HttpRequest, next: RequestResolver): Promise<HttpBaseResponse> {
    if(request.method == EHttpMethods.options)
      return new HttpResponse(
        200, 
        undefined, 
        this.accessControlHeaders
      );
    else return await next(request);
  }
  
  responseWriter(response: HttpBaseResponse, res: ServerResponse) {
    response.setHeaders(this.accessControlHeaders);
    response.write(res);
  }
}