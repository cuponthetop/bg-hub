import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
  }

  googleSignIn() {
    combineLatest(this.auth.signIn(), this.route.queryParams, (res: boolean, param: Params) => {
      return { success: res, redirectTo: param['return'] || '/' };
    })
      .subscribe((signInRes: { success: boolean, redirectTo: string }) => {
        if (signInRes.success) {
          this.router.navigateByUrl(signInRes.redirectTo);
        } else {
          console.error('login failed');
        }
      })
  }
}
