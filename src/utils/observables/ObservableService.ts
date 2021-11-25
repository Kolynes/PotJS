import { EServices, IIndexable } from "../../types";
import Service, { serviceClass } from "../services/Service";
import Observable from "./Observable";

@serviceClass(EServices.observables)
class ObservablesServices extends Service {
  private observables: IIndexable<Observable> = {};

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