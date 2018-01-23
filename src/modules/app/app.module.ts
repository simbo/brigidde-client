import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../shared/shared.module';
import { ChatModule } from './../chat/chat.module';
import { AppComponent } from './app.component';
import { ScreenComponent } from './screen/screen.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    SharedModule,
    ChatModule
  ],
  declarations: [
    AppComponent,
    ScreenComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
