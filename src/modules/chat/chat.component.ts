import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MessageBusService } from './../app/message-bus/message-bus.service';
import { TokenService } from './../server/token/token.service';
import { SocketService } from './../server/socket/socket.service';
import { ChatMessage } from './chat-message/chat-message';
import { ChatService } from './chat.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.pug',
  styleUrls: ['./chat.component.styl'],
  providers: [
    ChatService
  ]
})
export class ChatComponent implements OnInit, OnDestroy {

  public messageList: ChatMessage[];
  public subscriptions: Set<Subscription>;

  constructor(
    public chatService: ChatService,
    private msgBus: MessageBusService
  ) {
    this.subscriptions = new Set<Subscription>();
  }

  public ngOnInit(): void {
    this.chatService.connect();
    this.subscriptions.add(
      this.chatService.messageList.subscribe((list) => {
        this.messageList = list;
      })
    );
  }

  public ngOnDestroy(): void {
    this.chatService.disconnect();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
