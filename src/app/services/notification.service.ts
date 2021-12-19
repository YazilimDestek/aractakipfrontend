import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from "rxjs/Observable";
import { AppConfig } from 'app/app.config';


@Injectable()
export class NotificationService {
    Checkout: any[]
    constructor(private http: Http, private appConfig: AppConfig) { }

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }

    getNotification(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'Warning',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createNotification(notification): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'Warning', notification,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    getNotificationDetail(id): Observable<any> {
        return this.http.get(this.appConfig.apiUrl+'Warning/' + id, this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    updateNotification(notification): Observable<any> {
        let url = this.appConfig.apiUrl + 'Warning/' + notification.id;
        return this.http.put(url, notification,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }

    deleteNotification(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'Warning/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }

    uploadExcel(fileData): Observable<any>{
        return this.http.post(this.appConfig.apiUrl + 'Warning/uploadexcel', fileData, this.jwt()).map(res => res).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
    }

    getWarningType(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'WarningType/',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 

    }


    getFilter(filter): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'Warning/filter', filter,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
  


    private jwt() {
        // create authorization header with jwt token
        let userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlbnRyYXkuY29tIiwianRpIjoiZjI2ZmRjNmYtMzgxNC00YmZmLTk0YWYtYTJkM2Q1YWMyOTcyIiwidXNlciI6IntcIk5hbWVcIjpcIsOWWkdFXCIsXCJVc2VybmFtZVwiOlwib3pnZVwiLFwiU3VybmFtZVwiOlwiU8OcUk1FTMSwXCIsXCJFbWFpbFwiOlwib3pnZUBhbGJhdHJvc3lhemlsaW0uY29tXCIsXCJQYXNzd29yZFwiOlwiRTEwQURDMzk0OUJBNTlBQkJFNTZFMDU3RjIwRjg4M0VcIixcIklzQWRtaW5cIjp0cnVlLFwiSWRcIjoxLFwiSXNEZWxldGVkXCI6ZmFsc2UsXCJDcmVhdGVkRGF0ZVRpbWVcIjpcIjIwMjAtMDEtMDFUMDA6MDA6MDBcIixcIkNyZWF0ZWRVc2VySWRcIjoxLFwiVXBkYXRlZERhdGVUaW1lXCI6bnVsbCxcIlVwZGF0ZWRVc2VySWRcIjpudWxsfSIsIlVzZXJJRCI6IjEiLCJleHAiOjE3MTY4MzE2MzcsImlzcyI6IjE5Mi4xNjguMi43MCIsImF1ZCI6IjE5Mi4xNjguMi43MCJ9.duVVnAkG9AULtY-3T088u7LPbT81NgyaDztjQyyGH6A';
        if (userToken) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + userToken });
            return new RequestOptions({ headers: headers });
        }
    }
}
