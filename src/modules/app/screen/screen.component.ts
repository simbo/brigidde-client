import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MessageBusService } from './../../shared/message-bus/message-bus.service';

@Component({
  selector: 'screen',
  templateUrl: './screen.component.pug',
  styleUrls: ['./screen.component.styl']
})
export class ScreenComponent implements OnInit, OnDestroy {

  private windowResizeTimeout: number;
  private windowResizeHandler: () => void;
  private subscriptions: Set<Subscription>;
  private contentElement: HTMLElement;

  constructor(
    private elementRef: ElementRef,
    private msgBus: MessageBusService
  ) {
    this.windowResizeHandler = () => this.onWindowResize();
    this.subscriptions = new Set<Subscription>()
  }

  public ngOnInit(): void {
    this.contentElement = this.elementRef.nativeElement.firstElementChild;
    window.addEventListener('resize', this.windowResizeHandler);
    this.subscriptions.add(
      this.msgBus.channel('request:scroll-down:screen').subscribe(() => this.scrollDown())
    );
  }

  public ngOnDestroy(): void {
    window.removeEventListener('resize', this.windowResizeHandler);
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public onClick(event: Event): void {
    this.msgBus.push('request:focus:chat-input');
  }

  private get contentHeight(): number {
    return this.contentElement.offsetHeight;
  }

  private onWindowResize(): void {
    if (this.windowResizeTimeout) {
      window.clearTimeout(this.windowResizeTimeout);
    }
    this.windowResizeTimeout = window.setTimeout(() => this.scrollDown(), 50);
  }

  private scrollDown(): void {
    const el: HTMLElement = this.elementRef.nativeElement;
    const targetPosition = this.contentHeight - window.innerHeight;
    if (el.scrollTop <= targetPosition) {
      el.scrollTop = targetPosition;
    }
  }

}
