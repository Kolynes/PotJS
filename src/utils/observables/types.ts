import { IBasicSettings, IIndexable } from "../../types";
import Service from "../services/Service";
import Observable from "./Observable";

export interface IObservableService extends Service {
  addObservable(key: string, observable: Observable): void;
  getObservable(key: string): Observable;
}

export interface IObservablesSettings extends IBasicSettings {
  observables: IIndexable<string>;
}