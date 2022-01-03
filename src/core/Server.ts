import { IMiddlewareService } from "../middleware/types";
import { service } from "../utils/services/ServiceProvider";
import { createServer } from "http";
import HttpRequest from "../request/HttpRequest";
import { EHttpMethods, EServices, ILogger, ResponseWriter } from "./types";
import { HttpServerErrorResponse } from "../response/index";

export default class Server {
  static responseWriter: ResponseWriter = (response, res) => {
    response.write(res);
  }

  @service(EServices.middleware)
  middlewareService!: IMiddlewareService;

  @service(EServices.logger)
  logger!: ILogger;

  constructor(
    readonly host: string = "127.0.0.1",
    readonly port: number = 8000,
  ) {
    createServer(async (req, res) => {
      let body: any[] = [];
      req.on("readable", () => body.push(req.read()));
      req.on("end", async () => {
        body.pop();
        try {
          let request = await HttpRequest.createHttpRequest(req, Buffer.concat(body).toString("binary"))
          let response = await this.middlewareService.handle(request, 0);
          Server.responseWriter(response, res);
          this.logger.logResponse(request.url.toString(), response, req.method as EHttpMethods);
        } catch (e) {
          this.logger.log({ type: "error", message: `${String(e)}\n ${String((e as any).stack)}`})
          let response = new HttpServerErrorResponse(String(e) + "<br><br>" + String((e as any).stack))
          Server.responseWriter(response, res);
          this.logger.logResponse(req.url!.toString(), response, req.method as EHttpMethods);
        }
      })
    }).listen(this.port, this.host)
    this.logger.log({
      type: "info",
      message: `\nPotJS v0.2.1\nCreated by Kolynes C. Chinedu\nServer started on http://${this.host}:${this.port}`
    });
  }
}