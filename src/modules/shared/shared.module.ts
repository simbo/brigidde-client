import { NgModule } from '@angular/core';

import { MessageBusService } from './message-bus/message-bus.service';

@NgModule({
  providers: [
    MessageBusService
  ]
})
export class SharedModule {}
