import ServiceProvider from "../utils/services/ServiceProvider";
import { EServices, IIndexable, ISettings } from "./types";

export default abstract class Registry {
  static async initalize(settingsObject: IIndexable<any>){
    await import("./Settings");
    let settings = ServiceProvider.getInstance().getService<ISettings>(EServices.settings);
    settings.load(settingsObject);
    await import("../database");
    await import("../utils/observables/ObservableService");
    await import("./Logger");
    await import("../controllers/ControllerService");
    await import("../middleware/MiddlewareService");
    await import("../auth/AuthService");
  }
}