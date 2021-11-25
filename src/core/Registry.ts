import ServiceProvider from "../utils/services/ServiceProvider";
import { EServices, IIndexable, ISettings } from "./types";
import "./Settings";
import "../utils/observables/ObservableService";
import "./Logger";
import "../controllers/ControllerService";
import "../middleware/MiddlewareService";
import "../auth/AuthService";

export default abstract class Registry {
  static initialize(settingsObject: IIndexable<any>) {
    let settings = ServiceProvider.getInstance().getService<ISettings>(EServices.settings);
    settings.load(settingsObject);
  }
}