import { EServices } from "../../types";
import { service } from "../services/ServiceProvider";
import { IMailService } from "./types";

export default class Mail {
  @service(EServices.mail)
  mails!: IMailService;

  constructor(
    readonly to: string[],
    readonly subject: string,
    readonly text?: string,
    readonly html?: string,
    readonly from?: string,
  ) {
    
  }

  send(): Promise<any> {
    return this.mails.send(this);
  }
}