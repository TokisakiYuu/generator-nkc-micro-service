import * as runtime from "../src/config/runtime";
import { registerMicroService, ClientOnMessageData } from "../src/lib/communicationClient";

const serviceName = runtime.get("service name");
const isUseProcessIDasServiceID = runtime.get("use process id as service id") === "true";
const serviceId = isUseProcessIDasServiceID? process.pid : runtime.get("service id");
const client = registerMicroService(serviceName, String(serviceId));

describe("onMessage Process test group", () => {

  test.each([
    [{
      status: 200,
      content: { say: "hello" }
    }],
    [{
      status: 500,
      content: { say: "sorry" }
    }]
  ])("receive %s data", async (data: ClientOnMessageData) => {
    expect.assertions(1);
    const response = await new Promise((resolve) => {
      client.once("message", (res: ClientOnMessageData) => resolve(res));
      client.emit("message", data);
    });
    expect(response).toMatchObject({
      status: expect.any(Number),
      content: expect.anything()
    });
  });
});
