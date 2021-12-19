import { Component, OnInit, ViewChild, ElementRef, NgZone, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuelComponent } from '../fuel.component';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { FuelService } from 'app/services/fuel.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-fuel-form',
  templateUrl: './fuel-form.component.html',
  styleUrls: ['./fuel-form.component.scss']
})
export class FuelFormComponent implements OnInit {
  fuelForm : FormGroup;
  public fuel : any = {};
  public editMode : Boolean = false;
  public fuelTypes : any [];
  public vehicles : any [];
  public fuelCompanies : any [];
  public fuelStations : any [];
  public loading: boolean = false;
  public vehicle : any [] = [];

  ngOnInit() {
  }

  constructor(
    private toastrService : ToastrService,
    private fuelService : FuelService,
    private fb : FormBuilder,
    public dialogRef : MatDialogRef<FuelComponent>,
    @Inject(MAT_DIALOG_DATA) public rowData) {
      this.fuel = rowData.fuel;
      this.vehicles = rowData.vehicle;

      this.fuel.takenDate = new Date();

      if(Object.keys(this.fuel).length !== 0){
        this.editMode = true;
      } 

      this.fuelForm = this.fb.group({
        vehicleId: [''],
        fuelType: [''],
        liter: [''],
        takenDate: [''],
        mileage: ['']
      }); 
     }

     onNoClick(): void {
       this.dialogRef.close();
     }

     saveFull(){
         this.loading = true;
          if(!this.fuel.id){
            this.fuelService.createFuel(this.fuel).subscribe(
              fuel=>{
                this.loading = false;
                  if(fuel.meta.isSuccess == true){
                    this.dialogRef.close(fuel.entity);
                    this.toastrService.success('Yakıt Geçmişi Oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                  } else {
                    this.toastrService.error(fuel.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                  }
            })
  
          } else if(this.fuel.id){
            this.fuelService.updateFuel(this.fuel).subscribe(
              fuel=>{
                this.loading = false;
                  if(fuel.meta.isSuccess == true){
                    this.dialogRef.close(fuel.entity);
                    this.toastrService.success(' Yakıt geçmişi güncellendi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                  } else {
                    this.toastrService.error(fuel.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                  }
            })
  
          } 
 
 
 
    }
     isControlHasError(controlName: string, validationType: string): boolean {
       const control = this.fuelForm.controls[controlName];
       if(!control) {
         return false;
       }

       const result = control.hasError(validationType) && (control.dirty || control.touched);
       return result;
     }
  }
