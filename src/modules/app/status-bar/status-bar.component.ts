import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { SocketService } from './../../server/socket/socket.service';
import { StatusBarConnectionStatus } from './status-bar-connection-status.enum';

@Component({
  selector: 'status-bar',
  templateUrl: './status-bar.component.pug',
  styleUrls: ['./status-bar.component.styl']
})
export class StatusBarComponent implements OnInit, OnDestroy {

  private subscriptions: Set<Subscription>;
  private connectionStatusMessage: BehaviorSubject<string>;
  private connectionStatusInterval: number;

  constructor(
    private socketService: SocketService
  ) {
    this.connectionStatusMessage = new BehaviorSubject<string>('');
    this.subscriptions = new Set<Subscription>();
  }

  public ngOnInit(): void {
    this.subscriptions
      .add(this.socketService.onConnect.subscribe(() =>
        this.onConnectionStatusUpdate(StatusBarConnectionStatus.Connected)
      ))
      .add(this.socketService.onDisconnect.subscribe(() =>
        this.onConnectionStatusUpdate(StatusBarConnectionStatus.Disconnected)
      ))
      .add(this.socketService.onReconnectFailed.subscribe((attempts) =>
        this.onConnectionStatusUpdate(StatusBarConnectionStatus.RetryCountdown, attempts)
      ));
  }

  public ngOnDestroy(): void {
    Array.from(this.subscriptions.values())
      .forEach((subscription) => subscription.unsubscribe());
  }

  private onConnectionStatusUpdate(
    status: StatusBarConnectionStatus,
    attempts?: number
  ) {
    if (this.connectionStatusInterval) {
      window.clearInterval(this.connectionStatusInterval);
    }
    switch (status) {
      case StatusBarConnectionStatus.Connected:
        this.connectionStatusMessage.next('Connected');
        break;
      case StatusBarConnectionStatus.Disconnected:
        this.connectionStatusMessage.next('Disconnected');
        break;
      case StatusBarConnectionStatus.RetryCountdown:
        const nextTryTimestamp = SocketService.getReconnectRetryTimeout(attempts) + Date.now();
        const updateRetryMessage = () => {
          const secondsUntilNextTry = Math.ceil((nextTryTimestamp - Date.now()) / 1000);
          if (secondsUntilNextTry <= 0) {
            window.clearInterval(this.connectionStatusInterval);
            return;
          }
          this.connectionStatusMessage.next(
            `Connection failed. Retrying in ${secondsUntilNextTry} second${secondsUntilNextTry>1?'s':''}…`
          );
        };
        updateRetryMessage();
        this.connectionStatusInterval = window.setInterval(() => updateRetryMessage(), 200);
        break;
    }
  }

}
