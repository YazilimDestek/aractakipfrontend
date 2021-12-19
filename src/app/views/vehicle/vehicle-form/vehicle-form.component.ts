import { Component, Inject, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehicleComponent } from '../vehicle.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { VehicleService } from 'app/services/vehicle.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'vehicle-popup',
    templateUrl: 'vehicle-form.component.html',
    styleUrls : ['vehicle-form.component.scss']
  })
  export class VehicleFormComponent {
    public isShowBrands : Boolean = false;
    public isShowModels : Boolean = false;
    public loading : Boolean = false;
    vehicleForm : FormGroup;
    public vehicle : any = null;
    public brands : any [] = [];
    public models : any [] = [];
    public engines : any [] = [];
    public fuelTanks : any [] = [];
    public hydraulicTanks : any [] = []; 
    public editMode : Boolean = false;
    public vehicleTypes : any = [];
    public ownershipTypes : any = [];
    searchTerm$ = new Subject<string>();
    public events: string[] = [];
    planModel = new Date() ;
    public searchVehicleTypes : any = [];
    public searchedBrands : any = [];
    public isShowDropDown : Boolean = false;
    constructor(
      private toastrService : ToastrService,
      private vehicleService : VehicleService,
      private fb : FormBuilder,
      public dialogRef: MatDialogRef<VehicleComponent>,
      @Inject(MAT_DIALOG_DATA) public rowData) {
        this.vehicle = rowData.vehicle;
        this.brands = rowData.brands;
        this.models = rowData.models;
        this.engines = rowData.engines;
        this.fuelTanks = rowData.fuelTanks;
        this.hydraulicTanks = rowData.hydraulicTanks;
        this.vehicleTypes = rowData.vehicleTypes;
         
       
        //
        if(Object.keys(this.vehicle).length !== 0){
          this.editMode = true;
        }
        this.vehicleForm = this.fb.group({
          brandId : [''], // marka
          engineId : [''], // motor
          modelId : [''], // model
          vehicleTypeId : [''], // araç tipi
          modelYear : [''], // kodel yılı
          fuelTankId : [''], // yakıt tankı
          hydraulicTankId : [''],  // hidrolik tankı
          numberOfPeople : [''], // yolcu kapasitesi - kişi sayısı
          warrantyEndDate : [''], // garanti bitiş tarihi
          ownershipType : [''], // sahiplik tipi
          isGpsTracking : false, // GPS Takibi yapılıyor mu?
          usageType : [''],
          instantMileage : [''], // Anlık Kilometre
          tonnage : [''],
          plateNumber : ['']
        });
      }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    saveVehicle(){
      
      //console.log("vehicleFormValue",this.vehicle);
      this.loading = true;
          if(!this.vehicle.id){
            this.vehicleService.createVehicle(this.vehicle).subscribe(
              result=>{
                this.loading = false;
                  if(result.meta.isSuccess == true){
                    this.dialogRef.close();
                    this.toastrService.success('Araç Oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                  } else {
                    this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                  }
            })
  
          } else if(this.vehicle.id){
            this.vehicleService.updateVehicle(this.vehicle).subscribe(
              result=>{
                this.loading = false;
                  if(result.meta.isSuccess == true){
                    this.dialogRef.close();
                    this.toastrService.success('Araç Güncellendi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                  } else {
                    this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                  }
            })
  
          }
    }
    
    isControlHasError(controlName: string, validationType: string): boolean {
      const control = this.vehicleForm.controls[controlName];
      if (!control) {
        return false;
      }
  
      const result = control.hasError(validationType) && (control.dirty || control.touched);
      return result;
    }
    /* getSearchValue(value){
      if(value == 'brand'){
        return this.vehicleForm.value.brandName;
      } else if(value == 'model'){
        return this.vehicleForm.value.modelName;
      }
    }
    selectedBrand(event, brand){
      this.vehicleForm.controls['brandName'].patchValue(brand.name);
      this.vehicle.brandId = brand.id;
      this.isShowDropDown = false;

    }
    selectedModel(event, model){

      this.isShowModels = false;
      this.vehicleForm.controls['modelName'].patchValue(model.name);
      this.vehicle.brandId = model.id;

    }
    addNewItem(value, type){
      if(type=="brand"){
            this.loading = true;
            let brand : any = {}
            brand.name= value;
            this.vehicleService.createBrand(brand).subscribe(
              result=>{
                this.loading = false;
                  if(result.meta.isSuccess == true){
                        this.vehicle.brandId = result.entity.id;
                        this.vehicleForm.controls['brandName'].patchValue(result.entity.name);
                        this.toastrService.success(value + ' isimli marka oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true });
                  }else{
                    this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                  }
            });
      }else if(type="model"){
            this.loading = true;
            let model : any = {}
            model.name= value;
            this.vehicleService.createModel(model).subscribe(
              result=>{
                this.loading = false;
                  if(result.meta.isSuccess == true){
                        this.vehicle.modelId = result.entity.id;
                        this.vehicleForm.controls['modelName'].patchValue(result.entity.name);
                        this.toastrService.success(value + ' isimli model oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true });
                  }else{
                    this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                  }
            });

      }
      

    } */
  
}
export interface VehicleModel {
    name: string;
    symbol: string;
    description : string
    weight: string
}