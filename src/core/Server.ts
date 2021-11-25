import { IMiddlewareService } from "../middleware/types";
import { service } from "../utils/services/ServiceProvider";
import { createServer } from "http";
import HttpRequest from "../request/HttpRequest";
import HttpBadRequestResponse from "../response/HttpBadRequestResponse";
import { EServices, ILogger } from "./types";

export default class Server {

  @service(EServices.middleware)
  middlewareService!: IMiddlewareService;

  @service(EServices.logger)
  logger!: ILogger;

  constructor(
    readonly host: string = "127.0.0.1",
    readonly port: number = 8000
  ) {
    createServer(async (req, res) => {
      try {
        let request = await HttpRequest.createHttpRequest(req)
        let response = await this.middlewareService.handle(request, 0);
        this.logger.logResponse(request.url.toString(), response);
        response.write(res);
      } catch (e) {
        new HttpBadRequestResponse(String(e) + "<br><br>" + String((e as any).stack)).write(res)
      }
    }).listen(this.port, this.host)
    this.logger.log({
      type: "info",
      message: `\nPotJS v0.0.8\nCreated by Kolynes C. Chinedu\nServer started on http://${this.host}:${this.port}`
    });
  }
}