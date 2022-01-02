import { IncomingHttpHeaders, IncomingMessage } from "http";
import { BaseEntity } from "typeorm";
import { EHttpMethods, IIndexable } from "../types";
import { EContentTypes } from "../utils/content-types";
import querystring from "querystring";
import MultipartParser, { FilePart } from "../utils/parsers/MultipartParser";


export default class HttpRequest extends MultipartParser {
  user?: BaseEntity;

  private constructor(
    readonly headers: IncomingHttpHeaders,
    readonly url: URL,
    readonly method: EHttpMethods,
    readonly queryParameters?: URLSearchParams,
    readonly fields?: IIndexable<string | string[]>,
    readonly files?: IIndexable<FilePart | FilePart[]>,
    readonly body?: string | Buffer
  ) { 
    super();
  }

  setUser(user: BaseEntity) {
    this.user = user;
  }

  static createHttpRequest(baseRequest: IncomingMessage, body: string): Promise<HttpRequest> {

    return new Promise<HttpRequest>((resolve, reject) => {
      const url = new URL(baseRequest.url!, `http://${baseRequest.headers.host!}`);
      let contentTypeInfo = (baseRequest.headers["content-type"] || "").split(";");
      switch (contentTypeInfo[0]) {
        case EContentTypes.json:
          resolve(
            new HttpRequest(
              baseRequest.headers,
              url,
              baseRequest.method as EHttpMethods,
              url.searchParams,
              JSON.parse(body),
              undefined,
              body
            )
          );
          break;
        case EContentTypes.multipart:
          let [fields, files] = this.getFieldsAndFiles(baseRequest, body)
          resolve(
            new HttpRequest(
              baseRequest.headers,
              url,
              baseRequest.method as EHttpMethods,
              url.searchParams,
              fields,
              files,
              body
            )
          );
          break;
        case EContentTypes.urlencoded:
          resolve(
            new HttpRequest(
              baseRequest.headers,
              url,
              baseRequest.method as EHttpMethods,
              url.searchParams,
              querystring.parse<IIndexable<any>>(body),
              undefined,
              body
            )
          )
          break;
        default:
          resolve(
            new HttpRequest(
              baseRequest.headers,
              url,
              baseRequest.method as EHttpMethods,
              url.searchParams,
              undefined,
              undefined,
              body
            )
          );
      }
    });
  }
}