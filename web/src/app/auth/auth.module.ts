import {
  GoogleApiModule,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
} from "ng-gapi";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

const gapiClientConfig: NgGapiClientConfig = {
  client_id: "1050748936908-h6766qj1n6e93q6557nam35a5kghba4s.apps.googleusercontent.com",
  discoveryDocs: ["https://analyticsreporting.googleapis.com/$discovery/rest?version=v4"],
  scope: [
    "email"
  ].join(" "),
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
