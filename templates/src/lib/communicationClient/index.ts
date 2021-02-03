import CommunicationClientClass from "./CommunicationClient.class";

export * from "./CommunicationClient.class";
export const CommunicationClient = CommunicationClientClass;
export function registerMicroService(name: string, id: string): CommunicationClientClass {
  return new CommunicationClientClass({name, id});
}
