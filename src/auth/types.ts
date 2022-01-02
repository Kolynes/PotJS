import jwt from "jsonwebtoken";
import { BaseEntity } from "typeorm";
import { ISettings, IIndexable } from "../types";
import Service from "../utils/services/Service";

export interface IAuthService extends Service, IAuthenticator {
  login(id: any): string;
  addAuthenticator(authenticator: IAuthenticator): void;
}

export interface IAuthenticator {
  authenticate(credentials: IIndexable<string>): Promise<boolean>;
}

export interface IAuthSettings extends ISettings {
  UserModel: typeof BaseEntity;
  secretKey: string;
  jwtSigningOptions: jwt.SignOptions
}