import { EServices, IIndexable } from "../../types";
import Service, { serviceClass } from "../services/Service";
import { service } from "../services/ServiceProvider";
import Observable from "./Observable";
import { IObservablesSettings } from "./types";
import path from "path";

@serviceClass(EServices.observables)
class ObservablesServices extends Service {
  private observables: IIndexable<Observable> = {};

  @service(EServices.settings)
  private settings!: IObservablesSettings;

  async initState() {
    let observables = this.settings.observables || {};
    for(let key in observables)
      this.addObservable(key, await import(path.resolve(this.settings.sourceDirectory, observables[key])));
    super.initState(); 
  }

  addObservable(key: string, observable: Observable) {
    if(this.observables[key] === undefined)
      this.observables[key] = observable;
    else throw new Error(`The observable '${key}' has already been registered`);
  }

  getObservable(key: string) {
    const observable = this.observables[key];
    if(observable === undefined)
      throw new Error(`The observable '${key}' is not registered.`)
    else return observable;
  }
}