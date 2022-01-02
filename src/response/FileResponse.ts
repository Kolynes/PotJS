import { ReadStream } from "fs";
import { ServerResponse } from "http";
import { HttpBaseResponse } from ".";
import { IResponseFile } from "../types";

export default class FileResponse extends HttpBaseResponse {
  private readonly readStream: ReadStream;

  constructor(file: IResponseFile) {
    super(
      200,
      undefined,
      { "content-type": file.contentType, "content-length": file.contentLength }
    );
    this.readStream = file.readStream
  }

  write(res: ServerResponse) {
    res.writeHead(this.status, this.headers)
    this.readStream.pipe(res);
  }
}