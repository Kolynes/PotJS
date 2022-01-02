import { EServices } from "../../types";
import ServiceProvider from "../services/ServiceProvider";
import { IObservableService } from "./types";

type Listener<T> = (event: T) => Promise<void>;

export function observe(observableKey: string | symbol): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor) => {
    const observablesService = ServiceProvider.getInstance().getService<IObservableService>(EServices.observables);
    const observable = observablesService.getObservable(observableKey);
    observable.addListener(target[propertyKey].bind(target));
  }
}

export function observable(observableKey: string | symbol): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const observablesService = ServiceProvider.getInstance().getService<IObservableService>(EServices.observables);
    target[propertyKey] = observablesService.getObservable(observableKey);
  }
}

export function observableClass(observableKey: string | symbol): ClassDecorator {
  return (target: any) => {
    const observablesService = ServiceProvider.getInstance().getService<IObservableService>(EServices.observables);
    observablesService.addObservable(observableKey, new target());
  }
}

export default abstract class Observable<T> {
  private listeners: Listener<T>[] = [];

  protected emit(event: T) {
    let callList = (this.listeners || []).map(listener => new Promise((resolve) => resolve(listener(event))));
    Promise.all(callList);
  }

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }

  removeListener(listener: Listener<T>) {
    this.listeners = this.listeners.filter(element => element != listener)
  }
}