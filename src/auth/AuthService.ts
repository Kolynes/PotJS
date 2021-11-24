import Service, { serviceClass } from "../utils/services/Service";
import jwt from "jsonwebtoken";
import { service } from "../utils/services/ServiceProvider";
import { EServices, IAuthenticator, IAuthService, IAuthSettings, IIndexable } from "../types";

@serviceClass(EServices.auth)
class AuthService extends Service implements IAuthService {
  private authenticators: IAuthenticator[] = [];

  @service(EServices.settings)
  private settings!: IAuthSettings;

  async initState() {
    for(let authenticatorModule of this.settings.authenticators || [])
      this.addAuthenticator(await import(authenticatorModule));
    super.initState(); 
  }
  
  login(user: { id: string }): string {
    return jwt.sign(
      { id: user.id },
      this.settings.secretKey, 
      this.settings.jwtSigningOptions
    );
  }

  authenticate(credentials: IIndexable<string>): boolean {
    let result = true;
    for(let authenticator of this.authenticators)
      result = result && authenticator.authenticate(credentials);
    return result;
  }

  addAuthenticator(authenticator: IAuthenticator): void {
    this.authenticators.push(authenticator);
  }
}