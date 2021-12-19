import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from "rxjs/Observable";
import { AppConfig } from 'app/app.config';


@Injectable()
export class TireService {
    Checkout: any[]
    constructor(private http: Http, private appConfig: AppConfig) { }

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }

    getTire(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'tire',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createTire(tire): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'tire', tire,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    getStaffDetail(id): Observable<any> {
        return this.http.get(this.appConfig.apiUrl+'tire/' + id, this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    updateTire(tire): Observable<any> {
        let url = this.appConfig.apiUrl + 'tire/update/' + tire.id;
        return this.http.put(url, tire,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }

    deleteTire(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'tire/delete/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    uploadExcel(fileData): Observable<any>{
        return this.http.post(this.appConfig.apiUrl + 'tire/excelImport', fileData, this.jwt()).map(res => res).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
    }

    getFilter(filter): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'tire/filter', filter,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }

    //// Tire History ////

    getTireHistory(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'VehicleTireHistory',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createTireHistory(tire): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'VehicleTireHistory/create', tire,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    updateTireHistory(tire): Observable<any> {
        let url = this.appConfig.apiUrl + 'VehicleTireHistory/update/' + tire.id;
        return this.http.put(url, tire,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }

    deleteTireHistory(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'VehicleTireHistory/delete/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    getFilterTireHistory(filter): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'VehicleTireHistory/filter', filter,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
  

    private jwt() {
        // create authorization header with jwt token
        let userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlbnRyYXkuY29tIiwianRpIjoiODdlYjc3ODUtZGY4My00OTRiLTk3ZmQtZDc2N2RmNGRkYTAxIiwidXNlciI6IntcIk5hbWVcIjpcIsOWWkdFXCIsXCJVc2VybmFtZVwiOlwib3pnZVwiLFwiU3VybmFtZVwiOlwiU8OcUk1FTMSwXCIsXCJFbWFpbFwiOlwib3pnZUBhbGJhdHJvc3lhemlsaW0uY29tXCIsXCJQYXNzd29yZFwiOlwiRTEwQURDMzk0OUJBNTlBQkJFNTZFMDU3RjIwRjg4M0VcIixcIklzQWRtaW5cIjp0cnVlLFwiSWRcIjoxLFwiSXNEZWxldGVkXCI6ZmFsc2UsXCJDcmVhdGVkRGF0ZVRpbWVcIjpcIjIwMjAtMDEtMDFUMDA6MDA6MDBcIixcIkNyZWF0ZWRVc2VySWRcIjoxLFwiVXBkYXRlZERhdGVUaW1lXCI6bnVsbCxcIlVwZGF0ZWRVc2VySWRcIjpudWxsfSIsIlVzZXJJRCI6IjEiLCJleHAiOjE3MTY5NjMyMzMsImlzcyI6IjE5Mi4xNjguMi43MCIsImF1ZCI6IjE5Mi4xNjguMi43MCJ9.QTjvWvc_i-sCRO0pQcKW-dujLPQ9YcAzcfuX7nyRQ6Y';
        if (userToken) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + userToken });
            return new RequestOptions({ headers: headers });
        }
    }
}
