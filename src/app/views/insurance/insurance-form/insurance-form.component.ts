import { Component, Inject, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { InsuranceComponent } from '../insurance.component';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { InsuranceService } from 'app/services/insurance.service';



@Component({
  selector: 'insurance-popup',
  templateUrl: 'insurance-form.component.html',
})

      export class InsuranceFormComponent {
        public loading : Boolean = false;
        insuranceForm : FormGroup;
        public editMode : Boolean = false;
        public insurance : any = {};
        public insuranceType : any = [];
        public insuranceFirm : any = [];
        public events: string[] = [];
        public vehicles: any[] = [];
       // public vehicles : any [];
        planModel = new Date() ;
        public searchInsuranceType : any = [];
        public searchedInsuranceFirm : any = [];
        constructor(
          private toastrService : ToastrService,
          private insuranceService : InsuranceService,
          private fb : FormBuilder,
          public dialogRef: MatDialogRef<InsuranceComponent>,
          @Inject(MAT_DIALOG_DATA) public rowData) {
            this.insurance = rowData.insurance;
            this.vehicles = rowData.vehicles;
        
          
            if(Object.keys(this.insurance).length !== 0){
              this.editMode = true;
            }
            //const today = moment();
            //console.log("today",today.format("YYYY-MM-DDTHH:mm:ss"));
            this.insuranceForm = this.fb.group({
              vehicleId : [''],
               //documentPath : [''],
               //isActive : [''],
               dateStart : [''],
               dateEnd : [''],
               insuranceFirm : ['', Validators.required],
               insuranceType : ['', Validators.required],
               //previewUrl : [''],
             });
          }
      
        onNoClick(): void {
          this.dialogRef.close();
        }

      saveInsurance(){
      
        this.loading = true;
            if(!this.insurance.id){
              this.insuranceService.createInsurance(this.insurance).subscribe(
                result=>{
                  this.loading = false;
                    if(result.meta.isSuccess == true){
                      this.dialogRef.close(result.entity);
                      this.toastrService.success('Sigorta Oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                    } else {
                      this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                    }
              })
    
            } else if(this.insurance.id){
              this.insuranceService.updateInsurance(this.insurance).subscribe(
                result=>{
                  this.loading = false;
                    if(result.meta.isSuccess == true){
                      this.dialogRef.close(result.entity);
                      this.toastrService.success('Sigorta Bilgileri Güncellendi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                    } else {
                      this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                    }
              })
    
            }
      }
    

    isControlHasError(controlName: string, validationType: string): boolean {
      const control = this.insuranceForm.controls[controlName];
      if (!control) {
        return false;
      }
  
      const result = control.hasError(validationType) && (control.dirty || control.touched);
      return result;
    }

   
    
  
}

