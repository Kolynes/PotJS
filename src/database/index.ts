import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { EServices } from "../types";
import Service, { serviceClass } from "../utils/services/Service";

@serviceClass(EServices.database)
class DatabaseService extends Service {
  connection?: Connection;

  async initState() {
    this.connection = await createConnection();
    super.initState();
  }
}