import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { serverConnection } from '../server-connection/server-connection';

@Injectable()
export class TokenService {

  private readonly storageKey: string;

  constructor(
    private http: Http
  ) {
    this.storageKey = 'token';
  }

  public get(): Observable<string> {
    const tokenSubject = new Subject<string>();
    if (this.token) {
      window.setTimeout(() => tokenSubject.next(this.token))
    } else {
      const tokenUrl = new URL(
        `http${serverConnection.ssl?'s':''}://${serverConnection.hostname}:${serverConnection.port}`
      );
      tokenUrl.pathname = 'token';
      this.http.get(tokenUrl.toString())
        .map((response) => response.json())
        .map((data) => data.token || null)
        .catch((err) => Observable.of(null))
        .subscribe((token) => {
          this.token = token;
          tokenSubject.next(token);
        });
    }
    return tokenSubject.asObservable();
  }

  public clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  private get token(): string {
    return localStorage.getItem(this.storageKey);
  }

  private set token(value: string) {
    if (value === null) {
      this.clear();
      return;
    }
    localStorage.setItem(this.storageKey, value);
  }

}
