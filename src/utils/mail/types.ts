import Service from "../services/Service";
import Mail from "./Mail";

export interface IMailService extends Service {
  send(mail: Mail): Promise<any>
}