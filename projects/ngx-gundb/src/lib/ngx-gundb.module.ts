import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { NgxGundbOptions } from "./ngx-gundb.options";
import { NgxGundbRef, NgxGundbService } from "./ngx-gundb.service";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
})
export class NgxGundbModule {
  static forRoot(
    config?: NgxGundbOptions
  ): ModuleWithProviders<NgxGundbModule> {
    return {
      ngModule: NgxGundbModule,
      providers: [
        NgxGundbService,
        { provide: "ngxGundbOptions", useValue: config },
      ],
    };
  }
}

export { NgxGundbService, NgxGundbRef, NgxGundbOptions };
