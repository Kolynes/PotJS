import { ReadStream } from "fs";
import { FilePart } from "../utils/parsers/MultipartParser";
import Service from "../utils/services/Service";

export interface IFileService extends Service {
  save(file: FilePart): Promise<string>;
  get(filename: string): Promise<IResponseFile>;
  setHost(host: string): void;
}

export interface IResponseFile {
  readStream: ReadStream;
  contentType: string | string[];
  contentLength: number;
}

