import Service, { serviceClass } from "../utils/services/Service";
import jwt from "jsonwebtoken";
import { service } from "../utils/services/ServiceProvider";
import { 
  EServices, 
  IAuthenticator, 
  IAuthService, 
  IAuthSettings, 
  IIndexable 
} from "../types";

@serviceClass(EServices.auth)
class AuthService extends Service implements IAuthService {
  private authenticators: IAuthenticator[] = [];

  @service(EServices.settings)
  private settings!: IAuthSettings;
  
  login(id: any): string {
    return jwt.sign(
      { id },
      this.settings.secretKey, 
      this.settings.jwtSigningOptions
    );
  }

  async authenticate(credentials: IIndexable<string>): Promise<boolean> {
    let result = true;
    for(let authenticator of this.authenticators)
      result = result && await authenticator.authenticate(credentials);
    return result;
  }

  addAuthenticator(authenticator: IAuthenticator): void {
    this.authenticators.push(authenticator);
  }
}