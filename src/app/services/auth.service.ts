import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { of, Observable } from "rxjs";
import { Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from 'app/app.config';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  //Only for demo purpose
  authenticated = true;

  constructor(
    private router: Router,
    private http: Http, 
    private appConfig: AppConfig) {
  }

  signin(user) {
    return this.http.post(this.appConfig.apiUrl + 'Login', user)
        .map(res => res.json()).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
  }
  signout() {
    localStorage.removeItem('userToken');
    this.router.navigateByUrl("/login");
  }
}
