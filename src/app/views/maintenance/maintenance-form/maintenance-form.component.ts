import { Component, Inject,ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder,Validators,FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceComponent } from '../maintenance.component';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { MaintenanceService } from 'app/services/maintenance.service';
import { MaterialFileInputModule } from 'ngx-material-file-input';




@Component({
  selector: 'app-maintenance-form',
  templateUrl: './maintenance-form.component.html',
  styleUrls: ['./maintenance-form.component.scss']
})
export class MaintenanceFormComponent {
  maintenanceForm : FormGroup;
  public maintenance : any = null;
  public editMode : Boolean = false;
  public vehicleType : any [];
  public maintenanceCompanies : any [];
  loading: boolean;
   maintenancePath: string;
   public documentStatus: boolean= false;
  fileData: File = null;
  previewUrl:any = null;
  


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
      this.vehicleType = rowData.vehicleType;

      if(Object.keys(this.maintenance).length !== 0){
        this.editMode = true;
      }

      this.maintenanceForm = this.fb.group({
        //vehicleName : [''],
       /*  companyName : [''],
        billTotal : [''],
        serviceType : [''],
        serviceStart : [''],
        serviceEnd : [''],
        comment : [''],
        isGeneralService : [''], */
        vehicleTypeId:[''],
        maintenanceMileage:[''],
        maintenanceType: [''],
        rememberDate: [''],
        maintenancePath: [''],
      });






      

     





      /* this.serviceCompanies = [
        {
          id: 1,
          name: 'Yetkili Servis'
        },
        {
          id: 2,
          name: 'Euromaster'
        },
        {
          id: 3,
          name: 'Speedy'
        },
        {
          id: 4,
          name: 'Auto King'
        },
      ] */

     }
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
          //this.maintenance.maintenancePath = this.previewUrl;
          this.toastr.success('Sigorta görüntüsü başarıyla yüklendi.' , 'Başarılı!' , { timeOut: 5000, "progressBar": true });
        }
      }
    }


     onNoClick(): void {
      this.dialogRef.close();
    }

    saveMaintenance(){
        this.loading = true;
        this.maintenancePath='adaf';
             
          if(this.maintenancePath){
            this.maintenance.maintenancePath=this.maintenancePath;
          }
         if(!this.maintenance.id){
          
           this.maintenanceService.createMaintenance(this.maintenance).subscribe(
             result=>{
               this.loading = false;
                 if(result.meta.isSuccess == true){
                   this.dialogRef.close(result.entity);
                   this.toastr.success('Bakım Bilgileri Oluşturuldu.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                 } else {
                   this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                 }
           })
 
         } else if(this.maintenance.id){
           this.maintenanceService.updateMaintenance(this.maintenance).subscribe(
             result=>{
               this.loading = false;
                 if(result.meta.isSuccess == true){
                   this.dialogRef.close();
                   this.toastr.success('Bakım Bilgileri Güncellendi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                 } else {
                   this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                 }
           })
 
         } 



   }
   
   isControlHasError(controlName: string, validationType: string): boolean {
     const control = this.maintenanceForm.controls[controlName];
     if(!control) {
       return false;
     }

     const result = control.hasError(validationType) && (control.dirty || control.touched);
     return result;
   }

   

   
   ngOnInit(): void {
 }


uploadPhoto(){
  if(this.fileData){
    var formData = new FormData();
    //console.log("fileName", this.file);
    formData.append("selectedFile",this.fileData,this.fileData.name)
    this.maintenanceService.uploadImage(formData).subscribe(x => {
          this.loading = false;
          var result = x.json();
          if(result.meta.isSuccess == true){
                this.maintenancePath = result.entity;
                this.toastr.success('Doküman kaydedildi.','BAŞARILI', { timeOut: 1000 });
          }else{
            this.toastr.error(result.meta.errorMessage, 'HATA !', { timeOut: 1000 });
          }
        },
        )

  } else{
    this.toastr.warning("Lütfen öncelikle doküman seçiniz", 'UYARI !',{ timeOut: 2000 });
  }
    
}

}
export interface MaintenanceModel { 

}




