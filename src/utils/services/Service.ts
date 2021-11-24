import ServiceProvider from "./ServiceProvider";

export function serviceClass(key: any): ClassDecorator {
  return (target: any) => {
    ServiceProvider.getInstance().registerService(new target(), key);
  }
}

export default abstract class Service {
  private initialized: boolean = false;
  private onReadyStateCallback: Function = () => null;

  constructor(){}

  get isInitialized() {
    return this.initialized;
  }

  initState(...args: any[]){
    this.initialized = true;
    this.onReadyStateCallback();
  }

  onReadyState(callback: Function) {
    this.onReadyStateCallback = callback;
    if(this.initialized)
      this.onReadyStateCallback();
  }
}
