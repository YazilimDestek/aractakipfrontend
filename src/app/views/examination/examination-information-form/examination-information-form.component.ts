import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExaminationComponent } from '../examination.component';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ExaminationService } from 'app/services/examination.service';


@Component({
  selector: 'app-examination-information-form',
  templateUrl: './examination-information-form.component.html'
})
export class ExaminationInformationFormComponent {
  examinationInformationForm : FormGroup;
  public examination : any = null;
  public editMode : Boolean = false;
  public vehicles : any [];
  public documentStatus: boolean = false;
  fileData: File = null;
  previewUrl:any = null;
  loading: boolean;
  file: File = null;
  examinationResultDocument: string;
  
  
  

  constructor(
    private fb : FormBuilder,
    private toastr: ToastrService,
    
    private examinationService : ExaminationService,
    public dialogRef : MatDialogRef<ExaminationComponent>,
    @Inject(MAT_DIALOG_DATA) public rowData) {
      
      this.examination = rowData.examination;
      this.vehicles = rowData.vehicle; 
      

      if(Object.keys(this.examination).length !== 0){
        this.editMode = true;
      }

      this.examinationInformationForm = this.fb.group({
        vehicleId:[''],
        examinationResult : [''],
        examinationResultDocument : [''],
        examinationDate : ['']
        


        /* examinationResultDocument : [''],
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
          this.examination.documexaminationResultDocumententPath = this.previewUrl;
          this.toastr.success('Sigorta görüntüsü başarıyla yüklendi.' , 'Başarılı!' , { timeOut: 5000, "progressBar": true });
        }
      }
    }

     onNoClick(): void {
       this.dialogRef.close();
     }

     saveExamination(){
      this.loading = true;
      this.examination.userId=1;
      this.examinationResultDocument='asd';
      if(this.examinationResultDocument){
        this.examination.examinationResultDocument=this.examinationResultDocument;
      }
      if(!this.examination.id){
        this.examinationService.createExaminationInformation(this.examination).subscribe(
          examination=>{
            this.loading = false;
              if(examination.meta.isSuccess == true){
                this.dialogRef.close(examination.entity);
                this.toastr.success('Muayene Sonucu Oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
              } else {
                this.toastr.error(examination.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
              }
        })

      } else if(this.examination.id){
        this.examinationService.updateExaminationInformation(this.examination).subscribe(
          examination=>{
            this.loading = false;
              if(examination.meta.isSuccess == true){
                this.dialogRef.close();
                this.toastr.success('Muayene Güncellendi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
              } else {
                this.toastr.error(examination.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
              }
        })

      }
      
    }

     isControlHasError(controlName: string, validationType: string): boolean {
       const control = this.examinationInformationForm.controls[controlName];
       if(!control) {
         return false;
       }

       const result = control.hasError(validationType) && (control.touched || control.dirty);
       return result;
     }

/*      readUrl(event:any) {
      if (event.target.files && event.target.files[0]) {
          if(event.target.files[0].type == "image/png" || event.target.files[0].type == "image/jpeg"
           || event.target.files[0].type == "image/jpg"){
                  var reader = new FileReader();
              
                  reader.onload = (event:any) => {
                  this.url =  event.target.result;
                  }
                  reader.readAsDataURL(event.target.files[0]);
                  this.file = event.target.files[0];
              }else{
                  this.toastr.error('Lütfen fotoğraf seçiniz','UYARI !', { timeOut: 3000 });
              }
      }
    } */
    uploadPhoto(){
      if(this.fileData){
        var formData = new FormData();
        //console.log("fileName", this.file);
        formData.append("selectedFile",this.fileData,this.fileData.name)
        this.examinationService.uploadImage(formData).subscribe(x => {
              this.loading = false;
              var result = x.json();
              if(result.meta.isSuccess == true){
                    this.examinationResultDocument = result.entity;
                    this.toastr.success('Fotoğraf kaydedildi.','BAŞARILI', { timeOut: 1000 });
              }else{
                this.toastr.error(result.meta.errorMessage, 'HATA !', { timeOut: 1000 });
              }
            })
  
      } else{
        this.toastr.warning("Lütfen öncelikle fotoğraf seçiniz", 'UYARI !',{ timeOut: 2000 });
      }
        
    }
}

export interface InspectionModel {}