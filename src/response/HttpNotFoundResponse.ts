import HttpBaseResponse from "./HttpBaseResponse";

export default class HttpNotFoundResponse extends HttpBaseResponse {
  constructor() {
    super(404, "<h1>Error 404</h1> Resource not found");
    this.headers["Content-Type"] = "text/html";
  }
}