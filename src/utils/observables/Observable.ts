import { EServices } from "../../types";
import ServiceProvider from "../services/ServiceProvider";
import { IObservableService } from "./types";

type Listener = (event: Object) => Promise<void>;

export function observe(observableKey: string): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor) => {
    const observablesService = ServiceProvider.getInstance().getService<IObservableService>(EServices.observables);
    const observable = observablesService.getObservable(observableKey);
    observable.addListener(target[propertyKey]);
  }
}

export default abstract class Observable {
  private listeners: Listener[] = [];

  emit(event: Object) {
    let callList = (this.listeners || []).map(listener => () => listener(event));
    Promise.all(callList);
  }

  addListener(listener: Listener) {
    this.listeners.push(listener);
  }

  removeListener(listener: Listener) {
    this.listeners = this.listeners.filter(element => element != listener)
  }
}