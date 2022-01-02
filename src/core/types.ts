import { OutgoingMessage, ServerResponse } from "http";
import HttpResponse from "../response/HttpResponse";
import Service from "../utils/services/Service";

export interface ILogger extends Service {
  logResponse(url: string, response: HttpResponse, method: EHttpMethods): void;
  log(message: ILogMessage): void;
}

export interface ILogMessage {
  type: "error" | "info" | "success" | "warning";
  message: string
}

export interface ISettings extends Service, IIndexable<any> {
  load(input: IIndexable<any>): void;
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
  logger = "logger",
  files = "files",
  mail = "mail"
}

export interface IIndexable<T> {
  [key: string]: T;
}

export type ResponseWriter = (response: HttpResponse, res: ServerResponse) => void;