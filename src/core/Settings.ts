import { EServices, IIndexable, ISettings } from "../types";
import Service, { serviceClass } from "../utils/services/Service";
@serviceClass(EServices.settings)
class Settings extends Service {
  load(input: IIndexable<any>) {
    for(var property in input)
      Object.defineProperty(this, property, { value: input[property] });
  }

  [key: string]: any;
}
