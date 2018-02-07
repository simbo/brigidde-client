import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { serverConnection } from '../server-connection/server-connection';
import { TokenService } from './../token/token.service';
import { SocketServiceEvent } from './socket-service-event.interface';
import { SocketServiceMessage } from './socket-service-message.interface';
import { SocketServiceConnectionState } from './socket-service-connection-state.enum';
import { SocketServiceEventType } from './socket-service-event-type.enum';

@Injectable()
export class SocketService {

  private readonly eventEmitter: EventEmitter<SocketServiceEvent>;
  private readonly connectionStateSubject: BehaviorSubject<SocketServiceConnectionState>;

  private socket: WebSocket;
  private authToken: string;
  private messageQueue: SocketServiceMessage[];
  private autoReconnect: boolean = true;
  private autoReconnectTimeout: number = 0;
  private autoReconnectAttempts: number = 0;

  constructor(
    private tokenService: TokenService
  ) {
    this.eventEmitter = new EventEmitter<SocketServiceEvent>();
    this.connectionStateSubject = new BehaviorSubject<SocketServiceConnectionState>(null);
    this.messageQueue = [];
  }

  public get connectionState(): Observable<SocketServiceConnectionState> {
    return this.connectionStateSubject.asObservable();
  }

  public get onConnect(): Observable<void> {
    return this.connectionStateSubject
      .filter((state) => state === SocketServiceConnectionState.Connected)
      .map((state) => {
        return;
      });
  }

  public get onDisconnect(): Observable<void> {
    return this.connectionStateSubject
      .filter((state) => state === SocketServiceConnectionState.Disconnected)
      .map((state) => {
        return;
      });
  }

  public get onError(): Observable<Event> {
    return this.eventEmitter
      .filter((event) => event.type === SocketServiceEventType.Error)
      .map((event) => event.data);
  }

  public get onMessageReceived(): Observable<SocketServiceMessage> {
    return this.eventEmitter
      .filter((event) => event.type === SocketServiceEventType.MessageReceived)
      .map((event) => event.data);
  }

  public get onMessageSent(): Observable<SocketServiceMessage> {
    return this.eventEmitter
      .filter((event) => event.type === SocketServiceEventType.MessageSent)
      .map((event) => event.data);
  }

  public get onReconnectFailed(): Observable<number> {
    return this.eventEmitter
      .filter((event) => event.type === SocketServiceEventType.ReconnectFailed)
      .map((event) => event.data);
  }

  public connect(): void {
    if (this.ready) return;
    this.tokenService.get()
      .subscribe((token) => {
        this.authToken = token;
        this.initSocket();
      });
  }

  public disconnect(): void {
    this.autoReconnect = false;
    this.socket.close();
  }

  public send(message: SocketServiceMessage): void {
    if (this.ready) {
      this.socket.send(JSON.stringify(message));
      this.eventEmitter.emit({
        type: SocketServiceEventType.MessageSent,
        data: message
      });
    } else {
      this.messageQueue.push(message);
    }
  }

  private get ready(): boolean {
    return this.socket && (
      this.socket.readyState === SocketServiceConnectionState.Connected ||
      this.socket.readyState === SocketServiceConnectionState.Connecting
    );
  }

  private updateConnectionState(): void {
    if (!this.socket) return;
    const newState = this.socket.readyState;
    const oldState = this.connectionStateSubject.getValue();
    if (oldState !== newState) {
      this.connectionStateSubject.next(newState);
    }
  }

  private initSocket(): void {
    this.autoReconnect = true;
    let socketUrl = new URL(
      `ws${serverConnection.ssl?'s':''}://${serverConnection.hostname}:${serverConnection.port}`
    );
    socketUrl.searchParams.set('token', this.authToken);
    this.socket = new WebSocket(socketUrl.toString());
    this.socket.onerror = (event) => this.onSocketError(event);
    this.socket.onopen = (event) => this.onSocketOpen(event);
    this.socket.onclose = (event) => this.onSocketClose(event);
    this.socket.onmessage = (event) => this.onSocketMessage(event);
  }

  private onSocketOpen(event: Event) {
    this.autoReconnectAttempts = 0;
    this.updateConnectionState();
    this.processMessageQueue();
  }

  private onSocketClose(event: CloseEvent) {
    this.updateConnectionState();
    if (this.autoReconnect) {
      if (this.autoReconnectAttempts > 0) {
        this.eventEmitter.emit({
          type: SocketServiceEventType.ReconnectFailed,
          data: this.autoReconnectAttempts
        });
      }
      this.startAutoReconnect();
    }
  }

  private onSocketError(event: Event) {
    this.eventEmitter.emit({
      type: SocketServiceEventType.Error,
      data: event
    });
  }

  private onSocketMessage(event: MessageEvent) {
    this.eventEmitter.emit({
      type: SocketServiceEventType.MessageReceived,
      data: JSON.parse(event.data)
    });
  }

  private processMessageQueue(): void {
    const queue = [...this.messageQueue];
    this.messageQueue = [];
    queue.forEach((message) => this.send(message));
  }

  private startAutoReconnect(): void {
    if (this.autoReconnectTimeout) {
      window.clearInterval(this.autoReconnectTimeout);
    }
    this.autoReconnectTimeout = window.setTimeout(() => {
      if (this.socket && this.socket.readyState === SocketServiceConnectionState.Connected) return;
      this.autoReconnectAttempts++;
      this.connect();
    }, SocketService.getReconnectRetryTimeout(this.autoReconnectAttempts));
  }

  public static getReconnectRetryTimeout(failedAttempts: number): number {
    return Math.min(30000, 1000 * Math.pow(2, failedAttempts));
  }

}
