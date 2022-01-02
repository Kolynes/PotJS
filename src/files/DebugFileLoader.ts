import Controller, { controller, Get } from "../controllers";
import { HttpRequest } from "../request";
import { HttpBaseResponse, HttpResponse } from "../response";
import FileResponse from "../response/FileResponse";
import { EServices, IControllerService, ISettings } from "../types";
import ServiceProvider, { service } from "../utils/services/ServiceProvider";
import { IFileService } from "./types";

export default class DebugFileLoader extends Controller {
  private static readonly settings = ServiceProvider.getInstance().getService<ISettings>(EServices.settings);
  
  @service(EServices.files)
  private files!: IFileService;

  @service(EServices.controllers)
  private controllerService!: IControllerService

  constructor() {
    if(DebugFileLoader.settings.mediaURL) {
      super(DebugFileLoader.settings.mediaURL);
      this.controllerService.addController(this);
    }
    else throw new Error("'mediaURL' is not defined in settings.");
  }

  @Get()
  ping() {
    return new HttpResponse(200, "Hello from file loader");
  }

  @Get("/<filename:path>")
  async getFile(request: HttpRequest, filename: string): Promise<HttpBaseResponse> {
    if(DebugFileLoader.settings.debug)
      try {
        let file = await this.files.get(filename);
        return new FileResponse(file);
      } catch(e) {
        console.log(e)
        if(e == "File does not exist")
          return new HttpResponse(404);
        else throw e;
      }
    else return new HttpResponse(404);
  }
}