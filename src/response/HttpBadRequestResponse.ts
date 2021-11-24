import HttpBaseResponse from "./HttpBaseResponse";

export default class HttpBadRequestResponse extends HttpBaseResponse {
  constructor(message: string) {
    super(400, `<h1>Error 400</h1> ${message}`);
    this.headers["Content-Type"] = "text/html";
  }
}