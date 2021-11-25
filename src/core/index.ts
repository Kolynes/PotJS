import Registry from "./Registry";

async function createServer(host?: string, port?: number) {
  let Server = (await import("./Server")).default;
  new Server(host, port);
}

export {
  Registry,
  createServer
}