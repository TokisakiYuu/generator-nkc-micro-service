import "./config/runtime";
import "./config/log4js";
import * as runtime from "./config/runtime";
import { registerMicroService, ClientOnMessageData } from "./lib/communicationClient";

const serviceName = runtime.get("service name");
const isUseProcessIDasServiceID = runtime.get("use process id as service id") === "true";
const serviceId = isUseProcessIDasServiceID? process.pid : runtime.get("service id");

export function startup(): void {
  const client = registerMicroService(serviceName, String(serviceId));
  client.on("message", (data: ClientOnMessageData) => {
    console.log(data);
  });
}
