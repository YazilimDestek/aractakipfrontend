import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TireService } from 'app/services/tire.service';
import { ToastrService } from 'ngx-toastr';
import { TireComponent } from '../tire.component';

@Component({
  selector: 'app-tire-history-form',
  templateUrl: './tire-history-form.component.html',
  styleUrls: ['./tire-history-form.component.scss']
})
export class TireHistoryFormComponent implements OnInit {
  public tireHistoryForm : FormGroup;
  public tireHistory : any = {};
  public tires : any []= [];
  public editMode : Boolean = false;
  public vehicles : any [];
  public loading : Boolean = false;
  constructor(
    private tireService : TireService,
    private toastr: ToastrService,
    private fb : FormBuilder,
    public dialogRef : MatDialogRef<TireComponent>,
    @Inject(MAT_DIALOG_DATA) public rowData
  ) {
    this.tireHistory= rowData.tireHistory;
      this.vehicles = rowData.vehicles;
      this.tires = rowData.tires;

      if(Object.keys(this.tireHistory).length !== 0){
        this.editMode = true;
      }

      this.tireHistoryForm = this.fb.group({
    
        vehicleId:[''],
        tireId : [''],
        holeOrder:[''],
        removedDate: [''],
        installedDate: [''],
        removedReason : ['']
      });
   }

  ngOnInit(): void {
  }
  saveTireHistory(){
    this.loading = true;
     if(!this.tireHistory.id){
       this.tireService.createTireHistory(this.tireHistory).subscribe(
         result=>{
           this.loading = false;
             if(result.meta.isSuccess == true){
               this.dialogRef.close(result.entity);
               this.toastr.success('Lastik Geçmişi Oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
             } else {
               this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
             }
       })

     } else if(this.tireHistory.id){
       this.tireService.updateTireHistory(this.tireHistory).subscribe(
         result=>{
           this.loading = false;
             if(result.meta.isSuccess == true){
               this.dialogRef.close();
               this.toastr.success('Lastik Geçmişi Güncellendi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
             } else {
               this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
             }
       })

     } 



}

}
