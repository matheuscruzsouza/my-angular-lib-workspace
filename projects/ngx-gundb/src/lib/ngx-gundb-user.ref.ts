import { Inject, Injectable } from "@angular/core";
import { NgxGundbOptions } from "dist/ngx-gundb/public-api";
import { Observable } from "rxjs";
import { NgxGundbRef } from "./ngx-gundb.ref";

@Injectable()
export class NgxGundbUserRef extends NgxGundbRef {
  public user;

  constructor(
    @Inject("ngxGundbOptions") protected options: NgxGundbOptions = {}
  ) {
    super(options);

    this.user = this.gun.user().recall({ sessionStorage: true });
  }

  create<T>(alias: string, password: string, opt?: any): Observable<T> {
    return new Observable((subscriber) => {
      this.gun.get(`~@${alias}`).once((data: any) => {
        if (!data) {
          this.user.create(
            alias,
            password,
            (response: any) => {
              if (!response.err) {
                subscriber.next(this.extractData(response));
              } else {
                subscriber.error(response);
              }
              subscriber.complete();
            },
            opt
          );
        } else {
          subscriber.error({
            err: "User already created!",
          });
        }
      });
    });
  }

  auth<T>(
    alias: string,
    password: string,
    opt?: { change: string }
  ): Observable<T> {
    return new Observable((subscriber) => {
      this.user.auth(
        alias,
        password,
        (response: any) => {
          if (!response.err) {
            subscriber.next(this.extractData(response));
          } else {
            subscriber.error(response);
          }
          subscriber.complete();
        },
        opt
      );
    });
  }

  getUser<T>(alias: string): Observable<T> {
    return this.gun.get(`'~@${alias}'`).once();
  }

  getUserByPublicKey<T>(publicKey: string): Observable<T> {
    return this.gun.user(publicKey).once();
  }

  leave() {
    this.user.leave();
  }

  getLogged(): any {
    return this.user.is;
  }
}
