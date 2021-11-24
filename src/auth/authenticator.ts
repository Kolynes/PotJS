import { EServices, IAuthService } from "../types";
import ServiceProvider from "../utils/services/ServiceProvider";

export default function authenticator(target: any) {
  const authService = ServiceProvider.getInstance().getService<IAuthService>(EServices.auth);
  authService.addAuthenticator(new target());
}