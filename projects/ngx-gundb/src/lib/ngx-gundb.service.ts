import { Inject, Injectable, Optional } from "@angular/core";
import { NgxGundbSecurityRef } from "./ngx-gundb-security.ref";
import { NgxGundbUserRef } from "./ngx-gundb-user.ref";
import { NgxGundbOptions } from "./ngx-gundb.options";
import { NgxGundbRef } from "./ngx-gundb.ref";

@Injectable({
  providedIn: "root",
})
export class NgxGundbService {
  public db: NgxGundbRef;
  public user: NgxGundbUserRef;
  public security: NgxGundbSecurityRef;

  constructor(
    @Inject("ngxGundbOptions") @Optional() options?: NgxGundbOptions
  ) {
    this.db = new NgxGundbRef(options || {});
    this.user = new NgxGundbUserRef();
    this.security = new NgxGundbSecurityRef();
  }
}

export { NgxGundbRef, NgxGundbUserRef, NgxGundbSecurityRef, NgxGundbOptions };
