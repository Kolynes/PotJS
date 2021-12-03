import { ServerResponse, IncomingHttpHeaders } from "http";

export default abstract class HttpBaseResponse {
  constructor(
    readonly status: number,
    readonly body: string = "",
    readonly headers: IncomingHttpHeaders = {},
  ) {}

  write(res: ServerResponse) {
    res.writeHead(this.status, this.headers);
    res.write(this.body);
    res.end();
  }
}