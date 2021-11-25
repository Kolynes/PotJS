import HttpResponse from "../response/HttpResponse";
import Service from "../utils/services/Service";

export interface ILogger extends Service {
  logResponse(url: string, response: HttpResponse): void;
  log(message: ILogMessage): void;
}

export interface ILogMessage {
  type: "error" | "info" | "success" | "warning";
  message: string
}

export interface ISettings extends Service {
  load(input: IIndexable<any>): void;
}

export interface IBasicSettings {
  sourceDirectory: string;
}

export enum EHttpMethods {
  get = "GET",
  post = "POST",
  put = "PUT",
  delete = "DELETE",
  connect = "CONNECT",
  options = "OPTIONS",
  trace = "TRACE",
  patch = "PATCH"
}

export enum EServices {
  settings = "settings",
  middleware = "middleware",
  controllers = "controllers",
  database = "database",
  auth = "auth",
  observables = "observables",
  logger = "logger"
}

export interface IIndexable<T> {
  [key: string]: T;
}