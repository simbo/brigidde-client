import { Component, ElementRef, AfterViewInit, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as autosize from 'autosize';

import { MessageBusService } from './../../shared/message-bus/message-bus.service';
import { ChatService } from './../chat.service';

@Component({
  selector: 'chat-input',
  templateUrl: './chat-input.component.pug',
  styleUrls: ['./chat-input.component.styl']
})
export class ChatInputComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  public value: string;
  public textareaElement: HTMLElement;
  public subscriptions: Set<Subscription>;

  constructor(
    public chatService: ChatService,
    public msgBus: MessageBusService,
    public elementRef: ElementRef
  ) {
    this.subscriptions = new Set<Subscription>();
  }

  public onEnterKeyDown(event: KeyboardEvent): void {
    if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    this.submit();
  }

  public submit(): void {
    this.chatService.send(this.value);
    this.value = '';
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.msgBus.channel('request:focus:chat-input').subscribe(() => this.focus())
    );
  }

  public ngAfterViewInit(): void {
    this.textareaElement = this.elementRef.nativeElement.querySelector('textarea');
    this.textareaElement.addEventListener('autosize:resized', () => this.msgBus.push('request:scroll-down:screen'));
    autosize(this.textareaElement);
    this.focus();
  }

  public ngAfterViewChecked(): void {
    autosize.update(this.textareaElement);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private focus(): void {
    this.textareaElement.focus();
  }

}