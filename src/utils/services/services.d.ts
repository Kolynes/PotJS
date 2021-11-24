declare namespace NodeJS {
  export interface Global {
    serviceProvider: ServiceProvider;
  }
}

declare var global: NodeJs.Global;

interface Window {
  serviceProvider: ServiceProvider;
}