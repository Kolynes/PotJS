import { ServerResponse, OutgoingHttpHeaders } from "http";
export default abstract class HttpBaseResponse {
  constructor(
    readonly status: number,
    readonly body: string = "",
    readonly headers: OutgoingHttpHeaders = {},
  ) {}

  write(res: ServerResponse) {
    res.writeHead(this.status, this.headers);
    res.write(this.body);
    res.end();
  }

  setHeaders(headers: OutgoingHttpHeaders) {
    for(let header in headers)
      this.headers[header] = headers[header];
  }
}