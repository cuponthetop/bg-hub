import {
  GoogleApiModule,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
} from "ng-gapi";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuard } from "./auth.guard";

const gapiClientConfig: NgGapiClientConfig = {
  client_id: "1050748936908-9tp6t1uiuk2pq6q9a57ido1gtam1g4nk.apps.googleusercontent.com",
  discoveryDocs: ["https://analyticsreporting.googleapis.com/$discovery/rest?version=v4"],
  scope: [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/analytics"
  ].join(" ")
};

@NgModule({
  imports: [
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
    CommonModule,
  ],
  declarations: [
  ],
  providers: [
    AuthService
  ],
  exports: [

  ],

})
export class AuthModule { }
