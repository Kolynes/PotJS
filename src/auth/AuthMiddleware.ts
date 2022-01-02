import { BaseEntity } from "typeorm";
import { IMiddleware, RequestResolver } from "../middleware/types";
import HttpRequest from "../request/HttpRequest";
import HttpBaseResponse from "../response/HttpBaseResponse";
import { service } from "../utils/services/ServiceProvider";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IAuthSettings } from "./types";
import { EServices } from "../types";

export default class AuthMiddleware implements IMiddleware {
  @service(EServices.settings)
  private settings!: IAuthSettings;

  async handle(request: HttpRequest, next: RequestResolver): Promise<HttpBaseResponse> {
    if(request.headers.authorization !== undefined && request.headers.authorization.startsWith("Bearer")) {
      let token = request.headers.authorization.split(" ")[1];
      request.user = await this.validate(token);
    }
    return await next(request);
  }

  async validate(token: string): Promise<BaseEntity | undefined> {
    const UserModel = this.settings.UserModel;
    if(UserModel == undefined)
      throw new Error("UserModel is not set in settings");
    else {
      if(this.settings.secretKey == undefined)
        throw new Error("secretKey not set in settings")
      let data = jwt.verify(token, this.settings.secretKey);
      return await UserModel.findOne((data as JwtPayload).id);
    }
  }
}