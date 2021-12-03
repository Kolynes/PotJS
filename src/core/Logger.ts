import HttpResponse from "../response/HttpResponse";
import Service, { serviceClass } from "../utils/services/Service";
import { EHttpMethods, EServices, ILogger, ILogMessage } from "./types";

@serviceClass(EServices.logger)
class Logger extends Service implements ILogger {
  logResponse(url: string, response: HttpResponse, method: EHttpMethods): void {
    if(response.status > 299 || response.status < 200)
      this.log({
        type: "error",
        message: `${method} ${url} ${response.status} \n ${response.body}`
      });
    else this.log({
      type: "success",
      message: `${method} ${url} ${response.status}`
    });
  }

  log(message: ILogMessage): void {
    switch(message.type) {
      case "error":
        console.error(`ERROR [${new Date().toTimeString()}]: ${message.message}`);
        break;
      case "info":
        console.info(`INFO [${new Date().toTimeString()}]: ${message.message}`);
        break;
      case "success":
        console.log(`SUCCESS [${new Date().toTimeString()}]: ${message.message}`);
        break;
      case "warning":
        console.warn(`WARNING [${new Date().toTimeString()}]: ${message.message}`);
        break;
    }
  }
  
}