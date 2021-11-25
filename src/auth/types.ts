import jwt from "jsonwebtoken";
import { BaseEntity } from "typeorm";
import { IBasicSettings, IIndexable } from "../types";
import Service from "../utils/services/Service";

export interface IAuthService extends Service {
  login(user: {id: string}): string;
  authenticate(credentials: IIndexable<string>): boolean;
  addAuthenticator(authenticator: IAuthenticator): void;
}

export interface IAuthenticator {
  authenticate(credentials: IIndexable<string>): boolean;
}

export interface IAuthSettings extends IBasicSettings {
  UserModel: typeof BaseEntity;
  secretKey: string;
  jwtSigningOptions: jwt.SignOptions
}