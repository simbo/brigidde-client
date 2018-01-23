import * as uuid from 'uuid/v4';
import { Observable } from 'rxjs/Observable';

import { ChatMessageData } from './chat-message-data.interface';
import { ChatMessageType } from './chat-message-type.enum';
import { renderMarkdown } from './../../markdown/markdown';

export class ChatMessage {

  public id: string;
  public readonly body: string;
  public readonly type: ChatMessageType;
  public readonly date: Date;
  public readonly bodyRendered: Observable<string>;

  constructor(data: ChatMessageData) {
    this.body = data.body;
    this.id = data.hasOwnProperty('id') ? data.id : uuid();
    this.date = data.hasOwnProperty('date') ? new Date(data.date) : new Date();
    this.type = data.hasOwnProperty('type') ? data.type : ChatMessageType.Incoming;
    this.bodyRendered = this.renderBody();
  }

  public get isIncoming(): boolean {
    return this.type === ChatMessageType.Incoming;
  }

  public get isOutgoing(): boolean {
    return this.type === ChatMessageType.Outgoing;
  }

  public get isStatus(): boolean {
    return this.type === ChatMessageType.Status;
  }

  public get isWorking(): boolean {
    return this.type === ChatMessageType.Working;
  }

  public toJSON(): ChatMessageData {
    return {
      id: this.id,
      body: this.body,
      date: this.date.toISOString(),
      type: this.type
    };
  }

  private renderBody(): Observable<string> {
    if (this.isOutgoing) {
      const rendered = this.body
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/[\n\r]+/g, '<br>');
      return Observable.of(rendered);
    }
    return Observable.fromPromise(renderMarkdown(this.body));
  }

}
