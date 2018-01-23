import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SocketServiceMessage } from './../shared/socket/socket-service-message.interface';
import { SocketServiceEventType } from '../shared/socket/socket-service-event-type.enum';
import { SocketService } from './../shared/socket/socket.service';
import { ChatMessageType } from './chat-message/chat-message-type.enum';
import { ChatMessage } from './chat-message/chat-message';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {

  private readonly messagesSubject: BehaviorSubject<Map<string, ChatMessage>>;
  private readonly jobsSubject: BehaviorSubject<Set<string>>;
  private reconnectMessageInterval: number;

  constructor(
    private socketService: SocketService,
  ) {
    this.messagesSubject = new BehaviorSubject<Map<string, ChatMessage>>(new Map<string, ChatMessage>());
    this.jobsSubject = new BehaviorSubject<Set<string>>(new Set<string>());
    this.socketService.onConnect.subscribe(() => this.onConnect());
    this.socketService.onDisconnect.subscribe(() => this.onDisconnect());
    this.socketService.onReconnectFailed.subscribe((attempts) => this.onReconnectFailed(attempts));
    this.socketService.onMessageReceived.subscribe((data) => this.onMessageReceived(data));
    this.socketService.onMessageSent.subscribe((data) => this.onMessageSent(data));
  }

  public connect(): void {
    this.socketService.connect();
  }

  public disconnect(): void {
    this.socketService.disconnect();
  }

  public send(payload: string) {
    payload = payload
      // merge leading and trailing whitespace
      .replace(/(^\s+)|(\s+$)/g, ' ');
    if (payload.trim() === '') return;
    const type = 'message';
    this.socketService.send({type, payload});
  }

  public get messageList(): Observable<ChatMessage[]> {
    return this.messagesSubject
      .combineLatest(this.jobsSubject, (messages, jobs) => {
        if (jobs.size > 0 && !messages.has(ChatMessageType.Working)) {
          messages.set(ChatMessageType.Working, new ChatMessage({
            id: ChatMessageType.Working,
            type: ChatMessageType.Working,
            body: ''
          }));
        } else {
          messages.delete(ChatMessageType.Working);
        }
        return messages;
      })
      .map((messages) => Array.from(messages.values()))
      .map((messages) => messages.sort((a, b) => {
        if (a.type === ChatMessageType.Working) return 1;
        if (b.type === ChatMessageType.Working) return -1;
        if (a.date === b.date) return 0;
        return a.date > b.date ? 1 : -1;
      }));
  }

  private onConnect(): void {
    this.removeMessage('reconnect-attempts');
    this.addMessage(new ChatMessage({
      type: ChatMessageType.Status,
      body: 'Verbindung hergestellt.'
    }));
  }

  private onDisconnect(): void {
    this.addMessage(new ChatMessage({
      type: ChatMessageType.Status,
      body: 'Verbindung getrennt.'
    }));
  }

  private onReconnectFailed(attempts: number): void {
    if (this.reconnectMessageInterval) window.clearInterval(this.reconnectMessageInterval);
    const nextTryTimestamp = SocketService.getReconnectRetryTimeout(attempts) + Date.now();
    this.reconnectMessageInterval = window.setInterval(() => {
      const secondsUntilNextTry = Math.ceil((nextTryTimestamp - Date.now()) / 1000);
      if (secondsUntilNextTry <= 0) {
        window.clearInterval(this.reconnectMessageInterval);
        return;
      }
      this.addMessage(new ChatMessage({
        id: 'reconnect-attempts',
        type: ChatMessageType.Status,
        body: `${attempts} Verbindungsversuch${attempts > 1 ? 'e' : ''} fehlgeschlagen. ` +
          `Nächster Versuch in ${secondsUntilNextTry} Sekunden…`
      }));
    }, 200);
  }

  private onMessageReceived(data: SocketServiceMessage): void {
    let jobs: Set<string>;
    switch(data.type) {
      case 'job:started':
        jobs = this.jobsSubject.getValue();
        jobs.add(data.payload);
        this.jobsSubject.next(jobs)
        break;
      case 'job:finished':
        jobs = this.jobsSubject.getValue();
        jobs.delete(data.payload);
        this.jobsSubject.next(jobs)
        break;
      case 'message':
        this.addMessage(new ChatMessage({
          type: ChatMessageType.Incoming,
          body: data.payload
        }));
        break;
    }
  }

  private onMessageSent(data: SocketServiceMessage): void {
    switch(data.type) {
      case 'message':
        this.addMessage(new ChatMessage({
          type: ChatMessageType.Outgoing,
          body: data.payload
        }));
        break;
    }
  }

  private addMessage(message: ChatMessage): void {
    const messages = this.messagesSubject.getValue();
    messages.set(message.id, message);
    this.messagesSubject.next(messages);
  }

  private removeMessage(messageId: string): void {
    const messages = this.messagesSubject.getValue();
    messages.delete(messageId);
    this.messagesSubject.next(messages);
  }

}