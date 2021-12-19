import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TireComponent } from '../tire.component';
import { TireService } from 'app/services/tire.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tire-form',
  templateUrl: './tire-form.component.html',
  styleUrls: ['./tire-form.component.scss']
})
export class TireFormComponent{
  tireForm : FormGroup;
  public tire : any = null;
  public editMode : Boolean = false;
  public loading : Boolean = false;
  public tireBrands : any = [];  //lastik markaları
  public tireSeasons : any = []; //lastik sezonları (excel tablosundaki ModelID yerine kullanıldı)
  public tireModels : any = []; // lastik desenleri-modelleri (excel tablosundaki PatternName yerine kullanıldı)

  constructor(
    private tireService : TireService,
    private fb : FormBuilder,
    private toasterService : ToastrService,
    public dialogRef : MatDialogRef<TireComponent>,
    @Inject(MAT_DIALOG_DATA) public rowData: TireModel) {
      this.tire = rowData;

      if(Object.keys(this.tire).length !== 0){
        this.editMode = true;
      }

      this.tireForm = this.fb.group({
        brand : [''],
        model : [''],
        figure : [''],
        rimDiameter : [''],
        width : [''],
        height : [''],
        patternName : [''],
        serialNumber : [''],
        purchasedDateTime : [''],
        madeYear : [''],
        madeWeek : [''],
        vehicleID : [''],
        orderNumber : [''],
        startDateTime : [''],
        startKmHour : [''],
        endDateTime : [''],
        endKmHour : [''],
      });

      
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    saveTire(){
      this.loading = true;
        if(!this.tire.id){
          this.tireService.createTire(this.tire).subscribe(
            tire=>{
              this.loading = false;
                if(tire.meta.isSuccess == true){
                  this.dialogRef.close(tire.entity);
                  this.toasterService.success('Lastik Oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                } else {
                  this.toasterService.error(tire.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                }
          })

        } else if(this.tire.id){
          this.tireService.updateTire(this.tire).subscribe(
            tire=>{
              this.loading = false;
                if(tire.meta.isSuccess == true){
                  this.dialogRef.close(tire.entity);
                  this.toasterService.success('Lastik Güncellendi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                } else {
                  this.toasterService.error(tire.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                }
          })

        }
    }

    isControlHasError(controlName: string, validationType: string): boolean {
      const control = this.tireForm.controls[controlName];
      if(!control){
        return false;
      }

      const result = control.hasError(validationType) && (control.dirty || control.touched);
      return result;
    }
  }

  export interface TireModel {

  }