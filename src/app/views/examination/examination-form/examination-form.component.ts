import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExaminationComponent } from '../examination.component';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ExaminationService } from 'app/services/examination.service';


@Component({
  selector: 'app-examination-form',
  templateUrl: './examination-form.component.html',
  styleUrls: ['./examination-form.component.scss']
})
export class ExaminationFormComponent {
  examinationForm : FormGroup;
  public examination : any = null;
  public editMode : Boolean = false;
  public vehicleTypes : any [];
  public documentStatus: boolean = false;
  fileData: File = null;
  previewUrl:any = null;
  loading: boolean;

  constructor(
    private fb : FormBuilder,
    private toastr: ToastrService,
    private examinationService : ExaminationService,
    public dialogRef : MatDialogRef<ExaminationComponent>,
    @Inject(MAT_DIALOG_DATA) public rowData) {
      
      this.examination = rowData.examination;
      this.vehicleTypes = rowData.vehicleTypes; 
      

      if(Object.keys(this.examination).length !== 0){
        this.editMode = true;
      }

      this.examinationForm = this.fb.group({
        vehicleTypeId : [''],
        mileage : ['']
        /* documentPath : [''],
        isSuccess : [''],
        isGeneralInspection : [''],
        inspectionStart : [''],
        inspectionEnd : [''],
        comments : [''],
        previewUrl : [''], */
      })

    
     }

           //IMAGE UPLOAD AND VIEW 

    //UPLOAD
    fileProgress(fileInput: any) {
      if(fileInput.target.files[0].type == "image/png" || fileInput.target.files[0].type == "image/jpeg"
      || fileInput.target.files[0].type == "image/jpg"){         
        this.fileData = <File>fileInput.target.files[0];
        this.documentStatus = true;
        this.preview();
      } else {
        this.documentStatus = false;
        this.toastr.error('Lütfen kabul edilen formatlarda yükleme yapınız. (png, jpeg, jpg)','Format Hatası!', { timeOut: 5000, "progressBar": true });
      }
    }

    //PREVIEW
    preview() {
      // Show preview 
      var mimeType = this.fileData.type;
      if (mimeType.match(/image\/*/) == null) {
        return;
      }
    }

    //SUBMIT
    onSubmit(){
      if(this.documentStatus){
        var reader = new FileReader();      
        reader.readAsDataURL(this.fileData); 
        reader.onload = (_event) => { 
          this.previewUrl = reader.result;
          this.examination.documentPath = this.previewUrl;
          this.toastr.success('Muayene görüntüsü başarıyla yüklendi.' , 'Başarılı!' , { timeOut: 5000, "progressBar": true });
        }
      }
    }

     onNoClick(): void {
       this.dialogRef.close();
     }

     saveExamination(){
      this.loading = true;
      this.examination.userId=1;
    
      if(!this.examination.id){
        this.examinationService.createExamination(this.examination).subscribe(
          examination=>{
            this.loading = false;
              if(examination.meta.isSuccess == true){
                this.dialogRef.close(examination.entity);
                this.toastr.success('Muayene Oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
              } else {
                this.toastr.error(examination.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
              }
        })

      } else if(this.examination.id){
        this.examinationService.updateExamination(this.examination).subscribe(
          examination=>{
            this.loading = false;
              if(examination.meta.isSuccess == true){
                this.dialogRef.close(examination.entity);
                this.toastr.success('Muayene Güncellendi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
              } else {
                this.toastr.error(examination.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
              }
        })

      }
      
    }

     isControlHasError(controlName: string, validationType: string): boolean {
       const control = this.examinationForm.controls[controlName];
       if(!control) {
         return false;
       }

       const result = control.hasError(validationType) && (control.touched || control.dirty);
       return result;
     }
}

export interface ExaminationModel {}
