import { EServices, IIndexable, ISettings } from "../types";
import Service, { serviceClass } from "../utils/services/Service";
import {  } from "./types";

@serviceClass(EServices.settings)
class Settings extends Service implements ISettings{
  load(input: IIndexable<any>) {
    for(var property in input)
      Object.defineProperty(this, property, { value: input[property] });
  }

  [key: string]: any;
}
