import { SocketServiceEventType } from './socket-service-event-type.enum';

export interface SocketServiceEvent {
  type: SocketServiceEventType,
  data: any
}
