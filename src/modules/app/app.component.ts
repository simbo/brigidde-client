import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { SocketService } from './../server/socket/socket.service';

@Component({
  selector: 'body',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {

  constructor(
    private socketService: SocketService
  ) {
    this.socketService.connect();
  }

}
