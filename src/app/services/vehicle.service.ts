import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from "rxjs/Observable";
import { AppConfig } from 'app/app.config';


@Injectable()
export class VehicleService {
    Checkout: any[]
    constructor(private http: Http, private appConfig: AppConfig) { }

    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }

    getVehicle(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'vehicle',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createVehicle(vehicle): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'vehicle', vehicle,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    getVehicleDetail(id): Observable<any> {
        return this.http.get(this.appConfig.apiUrl+'vehicle/' + id, this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    updateVehicle(vehicle): Observable<any> {
        let url = this.appConfig.apiUrl + 'vehicle/' + vehicle.id;
        return this.http.put(url, vehicle,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    deleteVehicle(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'vehicle/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }

    getVehicleWithFilter(vehicle): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'vehicle/filter/', vehicle,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    //// Get Datas ////


    ///BRAND
    getBrand(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'brand',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createBrand(brand): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'brand/create/', brand,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    updateBrand(brand): Observable<any> {
        let url = this.appConfig.apiUrl + 'brand/update/' + brand.id;
        return this.http.put(url, brand,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    deleteBrand(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'brand/delete/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }



    /// MODEL
    getModel(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'model',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createModel(model): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'model/', model,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    updateModel(model): Observable<any> {
        let url = this.appConfig.apiUrl + 'model/update/' + model.id;
        return this.http.put(url, model,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    deleteModel(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'model/delete/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }

    /// Vehicle Types
    getVehicleType(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'vehicleType',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createVehicleType(vehicleType): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'vehicleType/create', vehicleType,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    updateVehicleType(vehicleType): Observable<any> {
        let url = this.appConfig.apiUrl + 'vehicleType/update/' + vehicleType.id;
        return this.http.put(url, vehicleType,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    deleteVehicleType(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'vehicleType/delete/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    
    /// Engine

    getEngine(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'engine',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createEngine(engine): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'engine/create', engine,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    updateEngine(engine): Observable<any> {
        let url = this.appConfig.apiUrl + 'engine/update/' + engine.id;
        return this.http.put(url, engine,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    deleteEngine(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'engine/delete/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }

    /// Fuel Tank
    getFuelTank(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'fuelTank',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createFuelTank(fuelTank): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'fuelTank/', fuelTank,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    updateFuelTank(fuelTank): Observable<any> {
        let url = this.appConfig.apiUrl + 'fuelTank/update/' + fuelTank.id;
        return this.http.put(url, fuelTank,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    deleteFuelTank(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'fuelTank/delete/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    /// Hydraulic Tank


    getHydraulicTank(): Observable<any>{
        return this.http.get(this.appConfig.apiUrl+'hydraulicTank',this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası')); 
    }
    createHydraulicTank(hydraulicTank): Observable<any> {
        return this.http.post(this.appConfig.apiUrl + 'hydraulicTank/', hydraulicTank,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    updateHydraulicTank(hydraulicTank): Observable<any> {
        let url = this.appConfig.apiUrl + 'hydraulicTank/update/' + hydraulicTank.id;
        return this.http.put(url, hydraulicTank,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    deleteHydraulicTank(id): Observable<any> {
        let url = this.appConfig.apiUrl + 'hydraulicTank/delete/' + id;
        return this.http.delete(url,this.jwt()).map(res => res.json()).catch((error: any) => Observable.throw(error || 'Sunucu Hatası'));
    }
    

  

    private jwt() {
        // create authorization header with jwt token
        let userToken = localStorage.getItem('userToken');
        userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlbnRyYXkuY29tIiwianRpIjoiYmJlM2IzZWYtNTIyYS00Y2MxLWE3MDktYjYwNzUyMjE0OWFmIiwidXNlciI6IntcIk5hbWVcIjpcIsOWWkdFXCIsXCJVc2VybmFtZVwiOlwib3pnZVwiLFwiU3VybmFtZVwiOlwiU8OcUk1FTMSwXCIsXCJFbWFpbFwiOlwib3pnZUBhbGJhdHJvc3lhemlsaW0uY29tXCIsXCJQYXNzd29yZFwiOlwiRTEwQURDMzk0OUJBNTlBQkJFNTZFMDU3RjIwRjg4M0VcIixcIklzQWRtaW5cIjp0cnVlLFwiSWRcIjoxLFwiSXNEZWxldGVkXCI6ZmFsc2UsXCJDcmVhdGVkRGF0ZVRpbWVcIjpcIjIwMjAtMDEtMDFUMDA6MDA6MDBcIixcIkNyZWF0ZWRVc2VySWRcIjoxLFwiVXBkYXRlZERhdGVUaW1lXCI6bnVsbCxcIlVwZGF0ZWRVc2VySWRcIjpudWxsfSIsIlVzZXJJRCI6IjEiLCJleHAiOjE3MTcwNjM2MDcsImlzcyI6IjE5Mi4xNjguMi43MCIsImF1ZCI6IjE5Mi4xNjguMi43MCJ9.oo9j2-CEE-B31Sd6VQoohg1_CyMRxoqWdym3S-yp0sA';
        if (userToken) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + userToken });
            return new RequestOptions({ headers: headers });
        }
    }
}
