import { EServices } from "../types";
import { service } from "../utils/services/ServiceProvider";
import HttpResponse from "./HttpBaseResponse";
import { IResponseSettings } from "./types";

export default class HttpServerErrorResponse extends HttpResponse {
  @service(EServices.settings)
  settings!: IResponseSettings;

  constructor(
    body?: string,
  ) {
    super(500, "");
    this.headers["Content-Type"] = "text/html";
    this.body!.concat(`<h1>Server Error</h1><br> ${this.settings.debug? body : ''}`);
  }
}