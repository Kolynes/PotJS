import { EServices, ISettings } from "../../types";
import Service, { serviceClass } from "../services/Service";
import { service } from "../services/ServiceProvider";
import Mail from "./Mail";
import { createTransport, Transporter } from "nodemailer";

@serviceClass(EServices.mail)
class MailService extends Service {
  @service(EServices.settings)
  private settings!: ISettings;

  private transporter?: Transporter;
  
  async send(mail: Mail): Promise<any> {
    if(!this.transporter) {
      const mailSettings = this.settings.mailSetup;
      if(!mailSettings)
        throw new Error("'mailSetup' not set in settings");
      this.transporter = createTransport(mailSettings);
    }
    return await this.transporter.sendMail({ ...mail, from: mail.from || this.settings.mailSetup.defaultSender });
  }
}