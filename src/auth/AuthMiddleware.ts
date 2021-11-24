import { BaseEntity } from "typeorm";
import { IMiddleware, RequestResolver } from "../middleware/types";
import HttpRequest from "../request/HttpRequest";
import HttpBaseResponse from "../response/HttpBaseResponse";
import { service } from "../utils/services/ServiceProvider";
import jwt from "jsonwebtoken";
import HttpResponse from "../response/HttpResponse";
import { IAuthSettings } from "./types";
import { EServices, IIndexable } from "../types";

export default class AuthMiddleware implements IMiddleware {
  @service(EServices.settings)
  private settings!: IAuthSettings;

  async handle(request: HttpRequest, next: RequestResolver): Promise<HttpBaseResponse> {
    if(request.headers.authorization !== undefined && request.headers.authorization.startsWith("Bearer")) {
      let token = request.headers.authorization.split(" ")[1];
      request.user = await this.validate(token);
      if(request.user == undefined)
        return new HttpResponse(401);
      return await next(request);
    } else {
      return new HttpResponse(401);
    }
  }

  async validate(token: string): Promise<BaseEntity | undefined> {
    const userModel = this.settings.userModel;
    if(userModel == undefined)
      throw new Error("userModel is not set in settings");
    else {
      let UserModel: typeof BaseEntity = await import(userModel);
      if(this.settings.secretKey == undefined)
        throw new Error("secretKey not set in settings")
      let data = jwt.verify(token, this.settings.secretKey);
      return await UserModel.findOne(data as IIndexable<any>);
    }
  }
}