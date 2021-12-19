import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from "rxjs/Observable";
import { AppConfig } from 'app/app.config';


@Injectable()
export class ExaminationService {
   
    constructor(private http: Http, private appConfig: AppConfig) { }

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }

    getExamination(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'Examination',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createExamination(examination): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'Examination', examination,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    getExaminationDetail(id): Observable<any> {
        return this.http.get(this.appConfig.apiUrl+'Examination/' + id, this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    updateExamination(examination): Observable<any> {
        let url = this.appConfig.apiUrl + 'Examination/update/' + examination.id;
        return this.http.put(url, examination,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }

    deleteExamination(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'Examination/delete/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    
    uploadExcel(fileData): Observable<any>{
        return this.http.post(this.appConfig.apiUrl + 'ExaminationInformation/excelImport', fileData, this.jwt()).map(res => res).catch((error: any) => Observable.throw(error || 'Bağlantı Hatası'));
    }
  
    getFilter(filter): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'Examination/filter', filter,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }

    //ExaminationInformatıon
    getExaminationInformation(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'ExaminationInformation',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createExaminationInformation(examination): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'ExaminationInformation', examination,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
   
    updateExaminationInformation(examination): Observable<any> {
        let url = this.appConfig.apiUrl + 'ExaminationInformation/update/' + examination.id;
        return this.http.put(url, examination,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }

    deleteExaminationInformation(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'ExaminationInformation/delete/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    uploadImage(formData): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'examination/uploadfiles',formData,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    
    
  
    getInformationFilter(Informationfilter): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'ExaminationInformation/filter', Informationfilter,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
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
