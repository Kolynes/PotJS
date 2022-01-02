import Service from "../services/Service";
import Observable from "./Observable";

export interface IObservableService extends Service {
  addObservable(key: string | symbol, observable: Observable<any>): void;
  getObservable<T extends Observable<any>>(key: string | symbol): T;
}