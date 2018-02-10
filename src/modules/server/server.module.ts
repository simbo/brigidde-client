import { NgModule } from '@angular/core';

import { SocketService } from './socket/socket.service';
import { TokenService } from './token/token.service';

@NgModule({
  providers: [
    SocketService,
    TokenService
  ]
})
export class ServerModule {}
