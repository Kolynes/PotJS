import Registry from "./Registry";
import Server from "./Server";

async function createServer(host?: string, port?: number) {
  new Server(host, port);
}

export {
  Registry,
  createServer
}