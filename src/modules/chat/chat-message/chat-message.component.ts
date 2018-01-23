import { Component, Input, OnInit, AfterViewInit, OnDestroy} from '@angular/core';

import { MessageBusService } from './../../shared/message-bus/message-bus.service';
import { ChatMessage } from './chat-message';

@Component({
  selector: 'chat-message',
  templateUrl: './chat-message.component.pug',
  styleUrls: ['./chat-message.component.styl']
})
export class ChatMessageComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() public message: ChatMessage

  constructor(
    private msgBus: MessageBusService
  ) {}

  public get classNames(): {[name: string]: boolean} {
    return {
      'is-incoming': this.message.isIncoming,
      'is-outgoing': this.message.isOutgoing,
      'is-status': this.message.isStatus,
      'is-working': this.message.isWorking
    };
  }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    this.msgBus.push('request:scroll-down:screen');
  }

  public ngOnDestroy(): void {
    this.msgBus.push('request:scroll-down:screen');
  }

}