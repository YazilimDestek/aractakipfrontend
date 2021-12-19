import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StaffComponent } from '../staff.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StaffService } from 'app/services/staff.service';
@Component({
  selector: 'app-staff-form',
  templateUrl: './staff-form.component.html',
  styleUrls: ['./staff-form.component.scss']
})
export class StaffFormComponent {

     public phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    staffForm : FormGroup;
    public staff : any = null;
    public editMode : Boolean = false;
    public loading : Boolean = false;

    constructor(
      private toastr:ToastrService,
      private staffService : StaffService,
      private fb : FormBuilder,
      public dialogRef: MatDialogRef<StaffComponent>,
      @Inject(MAT_DIALOG_DATA) public rowData: StaffModel) {
        this.staff = rowData;
        if(Object.keys(this.staff).length !== 0){
          this.editMode = true;
        }
  
  
        this.staffForm = this.fb.group({
          name : ['', Validators.required],
          surname : ['', Validators.required],
          email : [''],
          department : [''],
          position : [''],
          abysCode : [''],
          phone : [''],
          isTrackingEnable : [''],
          userId : 1// user ekleninceye kadar
        });
      }

      onNoClick(): void {
        this.dialogRef.close();
      }
      saveStaff(){
        this.loading = true;
        this.staff.userId=1;
        if(!this.staff.id){
          this.staffService.createStaff(this.staff).subscribe(
            staff=>{
              this.loading = false;
                if(staff.meta.isSuccess == true){
                  this.dialogRef.close(staff.entity);
                  this.toastr.success('Çalışan Oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                } else {
                  this.toastr.error(staff.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                }
          })

        } else if(this.staff.id){
          this.staffService.updateStaff(this.staff).subscribe(
            staff=>{
              this.loading = false;
                if(staff.meta.isSuccess == true){
                  this.dialogRef.close(staff.entity);
                  this.toastr.success('Çalışan Güncellendi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                } else {
                  this.toastr.error(staff.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                }
          })

        }
        
      }
      isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.staffForm.controls[controlName];
        if (!control) {
          return false;
        }
        const result = control.hasError(validationType) && (control.dirty || control.touched);
        return result;
      }

  ngOnInit(): void {
  }

}

export interface StaffModel {
  name: string;
  surname: string;
  dateOfRecruitment : number;
  position: string;
}
