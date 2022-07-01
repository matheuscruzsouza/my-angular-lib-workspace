import { Inject, Injectable } from "@angular/core";
import { NgxGundbOptions } from "./ngx-gundb.options";
import { Observable } from "rxjs";
import { NgxGundbRef } from "./ngx-gundb.ref";

@Injectable()
export class NgxGundbSecurityRef extends NgxGundbRef {
  public security;

  constructor(
    @Inject("ngxGundbOptions") protected options: NgxGundbOptions = {}
  ) {
    super(options);

    if (!this.isEmpty(this.options)) {
      this.gun.opt(this.options);
    }

    this.security = this.gun.SEA;
  }

  pair(opt?: any): Observable<any> {
    return new Observable((subscriber) => {
      this.security.pair((data: any) => {
        subscriber.next(data);
        subscriber.complete();
      }, opt);
    });
  }

  async sign(data: any, pair: any): Promise<any> {
    return await this.security.sign(data, pair);
  }

  /**
   * Allow others to write to parts of your own organization's graph without sharing your keypair with them.
   * @param who Who the certificate is for. These are the people you allow to write to your own graph. A public key array;
   * @param policy The rules of the Certificate. Policy may be set in a couple of ways: 'index'; {'*', 'index'}; [{'*', 'index'}, 'index'];
   * @param authority Certificate Authority or Certificate Issuer. This is your priv, or your key pair.
   * @param opt the options of the Certificate. Opt is an object that describe WHEN the Certificate expires, and a BLACKLIST in case you want to revoke access that you gave to someone: {expiry: Gun.state()+(60*60*24*1000), blacklist: 'blacklist'}.
   *
   * https://gun.eco/docs/SEA.certify
   */
  certify(
    who: string[],
    policy: any,
    authority: string,
    opt?: { expiry?: number; blacklist?: string }
  ) {
    return new Observable((subscriber) => {
      this.security.certify(
        who,
        policy,
        authority,
        (data: any) => {
          subscriber.next(data);
          subscriber.complete();
        },
        opt
      );
    });
  }

  async verify(data: any, pair: any): Promise<boolean> {
    return this.security.verify(data, pair);
  }

  async encrypt(data: any, pair: any): Promise<any> {
    return this.security.encrypt(data, pair);
  }

  async decrypt(data: any, pair: any): Promise<any> {
    return this.security.decrypt(data, pair);
  }
}
