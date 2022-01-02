import { EServices, IIndexable } from "../../types";
import Service, { serviceClass } from "../services/Service";
import Observable from "./Observable";

@serviceClass(EServices.observables)
class ObservablesServices extends Service {
  private observables: IIndexable<Observable<any>> = {};

  addObservable(key: string, observable: Observable<any>) {
    if(this.observables[key] === undefined)
      this.observables[key] = observable;
    else throw new Error(`The observable '${key}' has already been registered`);
  }

  getObservable<T extends Observable<any>>(key: string): T {
    const observable = this.observables[key] as T;
    if(observable === undefined)
      throw new Error(`The observable '${key}' is not registered.`)
    else return observable;
  }
}