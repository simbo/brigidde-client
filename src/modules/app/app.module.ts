import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { ServerModule } from './../server/server.module';
import { ChatModule } from './../chat/chat.module';
import { AppComponent } from './app.component';
import { ScreenComponent } from './screen/screen.component';
import { MessageBusService } from './message-bus/message-bus.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    ServerModule,
    ChatModule
  ],
  declarations: [
    AppComponent,
    ScreenComponent
  ],
  providers: [
    MessageBusService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
