import { OutgoingHttpHeaders } from "http2";
import HttpResponse from "./HttpBaseResponse";

export default class JsonResponse extends HttpResponse {
  constructor(
    status: number,
    body?: Object,
    headers?:  OutgoingHttpHeaders
  ) {
    headers = headers || {};
    headers["Content-Type"] = "application/json";
    super(status, JSON.stringify(body), headers);
  }
}