import { Component, Inject, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationComponent } from '../notification.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'app/services/notification.service';


@Component({
  selector: 'notification-popup',
  templateUrl: 'notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})
//export class NotificationFormComponent implements OnInit {
  export class NotificationFormComponent {
  notificationForm : FormGroup;
  public notification : any = null;
  public editMode : Boolean = false;
  public warningTypes : any [];
  public warningMethods : any [];
  public loading : Boolean = false;

  



  constructor(
    private fb : FormBuilder,
    public dialogRef : MatDialogRef<NotificationComponent>,
    private notificationService : NotificationService,
    private http: HttpClient,
    private toastr: ToastrService,

    @Inject(MAT_DIALOG_DATA) 
    //public rowData: NotificationModel,
    public rowData) {
      this.notification = rowData.notification;
      this.warningTypes=rowData.warningType;
    
  
    
       if(Object.keys(this.notification).length !== 0){
        this.editMode = true;    
      }

      this.notificationForm = this.fb.group({
        name : [''],
        daysLeft : [''],
        warningTypeId : [''],
        warningMethod : [''],
        description : [''],
      });

      
     }

     onNoClick(): void {
       this.dialogRef.close();
     }

     saveNotification(){
      
      this.loading = true;
          if(!this.notification.id){
            this.notificationService.createNotification(this.notification).subscribe(
              result=>{
                this.loading = false;
                  if(result.meta.isSuccess == true){
                    this.dialogRef.close(result.entity);
                    this.toastr.success('Uyarı Oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                  } else {
                    this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                  }
            })
  
          } else if(this.notification.id){
            this.notificationService.updateNotification(this.notification).subscribe(
              result=>{
                this.loading = false;
                  if(result.meta.isSuccess == true){
                    this.dialogRef.close(result.entity);
                    this.toastr.success('Uyarı Bilgileri Güncellendi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                  } else {
                    this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                  }
            })
  
          }
    }
  

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.notificationForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

 
  

}



