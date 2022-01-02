import { EServices, ISettings } from "../types";
import { FilePart } from "../utils/parsers/MultipartParser";
import Service, { serviceClass } from "../utils/services/Service";
import { service } from "../utils/services/ServiceProvider";
import { IFileService, IResponseFile } from "./types";
import path from "path";
import fs from "promise-fs";
import { Magic, MAGIC_MIME_ENCODING, MAGIC_MIME_TYPE } from "mmmagic";

@serviceClass(EServices.files)
class FileService extends Service implements IFileService {
  private host: string = "";

  @service(EServices.settings)
  settings!: ISettings;

  get mediaRoot(): string {
    let result = this.settings.mediaRoot;
    if(result !== undefined)
      return result;
    else throw new Error("'mediaRoot' was not defined in settings");
  }

  get mediaURL(): string {
    let result = this.settings.mediaURL;
    if(result !== undefined)
      return result;
    else throw new Error("'mediaURL' was not defined in settings");
  }

  setHost(host: string) {
    this.host = host;
  }

  async save(file: FilePart, directory: string = ""): Promise<string> {
    let newDate = new Date();
    let date = newDate.toISOString().substring(0, 10);
    let time = newDate.getTime();
    let absPath = path.resolve(this.mediaRoot, directory, date);
    if(!fs.existsSync(absPath))
      await fs.mkdir(absPath, { recursive: true });
    let predicate = file.filename!.substring(0, file.filename!.lastIndexOf("."))
    let mimeType = file.filename!.substring(file.filename!.lastIndexOf("."))
    let filename = escape(`${predicate}${time}${mimeType}`);
    let fileStream = fs.createWriteStream(path.resolve(absPath, filename));
    fileStream.write(file.value);
    fileStream.close();
    return new URL(path.resolve(this.mediaURL, directory, date, filename), this.host).href;
  }

  get(filename: string): Promise<IResponseFile> {
    return new Promise<IResponseFile>(async (resolve, reject) => {
      let filedir = path.resolve(this.mediaRoot, filename);
      if(fs.existsSync(filedir)) {
        let stat = await fs.stat(filedir);
        let magic = new Magic(MAGIC_MIME_TYPE | MAGIC_MIME_ENCODING);
        magic.detectFile(filedir, (err, result) => {
          if(err) reject(err);
          else resolve(
            { 
              readStream: fs.createReadStream(filedir), 
              contentLength: stat.size, 
              contentType: result 
            }
          );
        });
      } else reject("File does not exist");
    });
  }
}