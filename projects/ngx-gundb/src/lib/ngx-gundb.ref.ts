import { Inject, Injectable } from "@angular/core";
import { NgxGundbOptions } from "./ngx-gundb.options";
import { Observable } from "rxjs";

import * as Gun from "gun";
import { SEA } from "gun";
import "gun/sea.js";
import "gun/lib/load.js";
import "gun/lib/open.js";
import "gun/lib/unset.js";

@Injectable()
export class NgxGundbRef {
  public gun: any;

  constructor(
    @Inject("ngxGundbOptions") protected options: NgxGundbOptions = {}
  ) {
    this.gun = Gun();

    if (!this.isEmpty(this.options)) {
      if (this.options.SEA) {
        this.gun.SEA = SEA;
      }

      this.gun.opt(this.options);
    }
  }

  /**
   * Creates a new NgxGundbRef
   * @param gun Gun
   * @returns NgxGundbRef
   */
  static create(gun: any): NgxGundbRef {
    const newRef = new NgxGundbRef();
    newRef.gun = gun;
    return newRef;
  }

  /**
   * Apply a set of options
   * @param options NgxGundbOptions
   * @returns NgxGundbRef
   */
  opt(options: NgxGundbOptions): NgxGundbRef {
    this.gun.opt(options);
    return this;
  }

  /**
   * Returns a node from the Gun database
   * @param key string
   * @returns NgxGundbRef
   */
  get(key: string): NgxGundbRef {
    return NgxGundbRef.create(this.gun.get(key));
  }

  /**
   * Add data into a node from the Gun database
   * @param data string | Object
   * @returns NgxGundbRef
   */
  put(data: string | Object): NgxGundbRef {
    return NgxGundbRef.create(this.gun.put(this.array2object(data)));
  }

  /**
   * Add a array of data to a node from the Gun database
   * @param data String | Object
   * @returns NgxGundbRef
   */
  set(data: string | Object): NgxGundbRef {
    return NgxGundbRef.create(this.gun.set(this.gun.put(data)));
  }

  /**
   * Remove data from a set from the Gun database
   * @param data NgxGundbRef
   * @returns NgxGundbRef
   */
  unset(data: NgxGundbRef): NgxGundbRef {
    return NgxGundbRef.create(this.gun.unset(data));
  }

  /**
   * Loop throught a node data in the Gun database
   * @returns NgxGundbRef
   */
  map(): NgxGundbRef {
    return NgxGundbRef.create(this.gun.map());
  }

  /**
   * Returns a level up in the node hierarchy
   * @returns NgxGundbRef
   */
  back(): NgxGundbRef {
    return NgxGundbRef.create(this.gun.back());
  }

  /**
   * Verify the first change on the node in the Gun database
   * @returns Observable<T>
   */
  once<T>(): Observable<T> {
    return new Observable((o) => {
      this.gun.once((data: any, key: string, at: any, ev: any) => {
        o.next(this.extractData(data));
        o.complete();
      });
    });
  }

  /**
   * Return values on the node in the Gun database
   * @returns Observable<T>
   */
  val<T>(): Observable<T> {
    return new Observable((o) => {
      this.gun.val((data: any, key: string, at: any, ev: any) => {
        o.next(this.extractData(data));
        o.complete();
      });
    });
  }

  /**
   * Verify for changes on the node in the Gun database
   * @returns Observable<T>
   */
  on<T>(): Observable<T> {
    return new Observable((o) => {
      let stopped = false;
      this.gun.on((data: T, key: string, at: any, ev: any) => {
        if (stopped) {
          o.complete();
          return ev.off();
        }
        o.next(this.extractData(data));
      });
      return () => {
        stopped = true;
      };
    });
  }

  /**
   * Verify for changes on the node in the Gun database
   * @returns Observable<T>
   */
   open<T>(): Observable<T> {
    return new Observable((o) => {
      let stopped = false;
      this.gun.open((data: T, key: string, at: any, ev: any) => {
        if (stopped) {
          o.complete();
          return ev.off();
        }
        o.next(this.object2array(this.extractData(data)));
      });
      return () => {
        stopped = true;
      };
    });
  }

  /**
   * Verify for changes on the node in the Gun database
   * @returns Observable<T>
   */
   load<T>(): Observable<T> {
    return new Observable((o) => {
      let stopped = false;
      this.gun.load((data: T, key: string, at: any, ev: any) => {
        if (stopped) {
          o.complete();
          return ev.off();
        }
        o.next(this.object2array(this.extractData(data)));
      });
      return () => {
        stopped = true;
      };
    });
  }

  protected isEmpty(objectToCheck: Object): boolean {
    return objectToCheck.constructor === Object
      ? Object.entries(objectToCheck).length === 0
      : false;
  }

  protected pickBy(object: Object, predicate = (v: any, k: string) => v) {
    return Object.assign(
      {},
      ...Object.entries(object)
        .filter(([k, v]) => predicate(v, k))
        .map(([k, v]) => ({ [k]: v }))
    );
  }

  protected extractData(data: any) {
    if (!data) {
      return null;
    }

    return this.pickBy(
      data,
      (val: any, key: string) => val !== null && key !== "_"
    );
  }

  array2object(arr: any) {
    if (arr == null || (typeof arr != 'object' && !Array.isArray(arr))) {
      return arr;
    }

    let obj: any = {}

    Object.entries(arr).forEach(entrie => {
      if (Array.isArray(entrie[1]) || typeof entrie[1] === 'object') {
        obj[entrie[0]] = this.array2object(entrie[1]);
      } else {
        obj[entrie[0]] = entrie[1];
      }
    })

    if (obj[0]) {
      obj.length = Object.keys(obj).sort().pop()
      obj.length++
    }

    return obj
  }

  object2array(value: any) {
    if (typeof value === 'object') {
      let obj: any = {};

      Object.entries(value).forEach((entrie: [string, any]) => {
        if (typeof entrie[1] === 'object' && entrie[1].hasOwnProperty('length')) {
          delete entrie[1].length;
          obj[entrie[0]] = Object.values(entrie[1]).map(item => this.object2array(item));
        } else {
          obj[entrie[0]] = entrie[1];
        }
      });

      return obj;
    }

    return value;

  }
}
