import { Component, Inject,ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder,Validators,FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceComponent } from '../maintenance.component';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { MaintenanceService } from 'app/services/maintenance.service';




@Component({
  selector: 'app-maintenance-result-form',
  templateUrl: './maintenance-result-form.component.html',
  styleUrls: ['./maintenance-result-form.component.scss']
})
export class MaintenanceResultFormComponent {
  maintenanceResultForm : FormGroup;
  public maintenance : any = null;
  public editMode : Boolean = false;
  public vehicles : any [];
  public maintenanceCompanies : any [];
  loading: boolean;


    public events: string[] = [];
    planModel = new Date() ;

  constructor(

    private toastr: ToastrService,
    private fb : FormBuilder,
    public dialogRef : MatDialogRef<MaintenanceComponent>,
    private maintenanceService : MaintenanceService,
    private http: HttpClient,

    @Inject(MAT_DIALOG_DATA) public rowData) {
      this.maintenance= rowData.maintenance;
      this.vehicles = rowData.vehicle;

      if(Object.keys(this.maintenance).length !== 0){
        this.editMode = true;
      }

      this.maintenanceResultForm = this.fb.group({
    
        vehicleId:[''],
        maintenanceMileage:[''],
        maintenanceType: [''],
        maintenanceDate: [''],
      });
     

     }

     onNoClick(): void {
      this.dialogRef.close();
    }

    saveMaintenance(){
        this.loading = true;
         if(!this.maintenance.id){
           this.maintenanceService.createMaintenanceResult(this.maintenance).subscribe(
             result=>{
               this.loading = false;
                 if(result.meta.isSuccess == true){
                   this.dialogRef.close(result.entity);
                   this.toastr.success('Bakım Sonucu Oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                 } else {
                   this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                 }
           })
 
         } else if(this.maintenance.id){
           this.maintenanceService.updateMaintenanceResult(this.maintenance).subscribe(
             result=>{
               this.loading = false;
                 if(result.meta.isSuccess == true){
                   this.dialogRef.close();
                   this.toastr.success('Bakım Sonucu Güncellendi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                 } else {
                   this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                 }
           })
 
         } 



   }
   
   isControlHasError(controlName: string, validationType: string): boolean {
     const control = this.maintenanceResultForm.controls[controlName];
     if(!control) {
       return false;
     }

     const result = control.hasError(validationType) && (control.dirty || control.touched);
     return result;
   }

   

   
   ngOnInit(): void {
 }
}


export interface MaintenanceModel { 
 
}




