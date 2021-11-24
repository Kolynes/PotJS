import formidable from "formidable";
import { IncomingHttpHeaders, IncomingMessage } from "http";
import { BaseEntity } from "typeorm";
import { EHttpMethods } from "../types";

export default class HttpRequest {  
  user?: BaseEntity;

  private constructor(
    readonly headers: IncomingHttpHeaders,
    readonly url: URL,
    readonly method: EHttpMethods,
    readonly queryParameters: URLSearchParams,
    readonly fields: formidable.Fields,
    readonly files: formidable.Files,
  ) {}

  setUser(user: BaseEntity) {
    this.user = user;
  }

  static createHttpRequest(baseRequest: IncomingMessage): Promise<HttpRequest> {
    return new Promise<HttpRequest>((resolve, reject) => {
      const form = formidable();
      const url = new URL(baseRequest.url!, `http://${baseRequest.headers.host!}`);
      form.parse(baseRequest, (err, fields, files) => {
        if(err)
          reject(String(err))
        else resolve(
          new HttpRequest(
            baseRequest.headers,
            url,
            baseRequest.method as EHttpMethods,
            url.searchParams,
            fields,
            files
          )
        );
      })
    });
  }
}