import { IncomingMessage } from "http";
import { IIndexable } from "../../types";

export interface Part {
  value: Buffer | string | null;
  filename: string | null;
  contentType: string | null;
  name: string | null;
}

export interface FilePart {
  value: Buffer | string | null;
  filename: string | null;
  contentType: string | null;
}

export default abstract class MultipartParser {

  static getBoundary(request: IncomingMessage): string | null {
    try {
      return request.headers["content-type"]!
        .split(";")
        .map(value => value.trim())
        .find(value => value.startsWith("boundary="))!
        .slice("boundary=".length)
    } catch (e) {
      console.log(e)
      return null;
    }
  }

  static getPartValues(part: string): Part {
    let findName = /(?:name=")(.+?)(?:")/.exec(part)
    let findFilename = /(?:filename=")(.+?)(?:")/.exec(part)
    let findContentType = /(?:Content-Type: )(.+?)(?:\r\n)/.exec(part)
    let findValue = /(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/.exec(part)
    return {
      name: findName && findName[1],
      filename: findFilename && findFilename[1],
      contentType: findContentType && findContentType[1],
      value: findValue && Buffer.from(findValue[1], "binary")
    }
  }

  static getFieldsAndFiles(baseRequest: IncomingMessage, body: string): [IIndexable<string | string[]>, IIndexable<FilePart | FilePart[]>] {
    baseRequest.setEncoding("latin1")
    let boundary = this.getBoundary(baseRequest);
    let parts = body.split(boundary!)
    let fields: IIndexable<string | string[]> = {};
    let files: IIndexable<FilePart | FilePart[]> = {};
    for (let part of parts) {
      let partValues = this.getPartValues(part);
      if(partValues.name === null)
        continue;
      if (partValues.filename != null) {
        let file = {
          filename: partValues.filename,
          value: partValues.value,
          contentType: partValues.contentType
        };
        if (files[partValues.name!] === undefined)
          files[partValues.name!] = file;
        else if (files[partValues.name!] instanceof Object) {
          files[partValues.name!] = [files[partValues.name!] as FilePart];
          (files[partValues.name!] as FilePart[]).push(file);
        }
        else (files[partValues.name!] as FilePart[]).push(file);
      }
      else {
        if (fields[partValues.name!] === undefined) {
          fields[partValues.name!] = (partValues.value as Buffer).toString();
        }
        else if (fields[partValues.name!] instanceof String) {
          fields[partValues.name!] = [fields[partValues.name!] as string];
          (fields[partValues.name!] as string[]).push((partValues.value as Buffer).toString())
        }
      }
    }
    return [fields, files];
  }
}