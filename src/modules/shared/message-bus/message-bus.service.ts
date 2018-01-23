import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MessageBusMessage } from './message-bus-message.interface';

@Injectable()
export class MessageBusService {

  public readonly bus: Subject<MessageBusMessage>;

  constructor() {
    this.bus = new Subject<MessageBusMessage>();
  }

  public push(channel: string, data?: any): void {
    this.bus
      .next({channel, data});
  }

  public channel(channels: string | string[]): Observable<any> {
    if (!Array.isArray(channels)) channels = [channels];
    return this.bus
      .filter((msg) => channels.indexOf(msg.channel) !== -1)
      .map((msg) => msg.data);
  }

}
