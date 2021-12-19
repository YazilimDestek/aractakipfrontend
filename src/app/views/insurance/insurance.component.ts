import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { InsuranceFormComponent } from './insurance-form/insurance-form.component'
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { InsuranceService } from 'app/services/insurance.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { clear } from 'console';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { VehicleService } from 'app/services/vehicle.service';



export interface Insurance{
  vehicleID: number;
  documentPath: string;
  isActive: boolean;
  dateStart: Date;
  dateEnd: Date;
  insuranceFirm: string;
  insuranceType: string;

}



@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
  @ViewChild('excelFile', {static:false}) public excelFile: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['vehicle','dateStart', 'dateEnd', 'insuranceFirm', 'insuranceType', 'actions'];
  rowData : any =   {};
  public loading  : Boolean = false;
  public data : any [] = [];
  public vehicles : any []= [];
  public isOpenImport : Boolean = false;
  public dataSource = new MatTableDataSource<any>([]);
  public filter : any = {};
  public isFilterOpen : Boolean = false;
  

  // confirm delete operation
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  storedItemService: any;
  private _toasterService: any;
  importExcelOpen: boolean;

  constructor(
     public dialog: MatDialog,
     private vehicleService : VehicleService,
    private insuranceService : InsuranceService,
    private toastr: ToastrService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService) { 
      this._fuseTranslationLoaderService.loadTranslations(english, turkish);
      this.filter.dateStart = new Date();
      this.filter.dateEnd = new Date(); 
   
    }

    

  ngOnInit(): void {
    //this.getInsurance();
    this.getFilter();
    this.getVehicles();
    
  
  }

  getFilter(){
    this.loading = true;
    this.insuranceService.getFilter(this.filter).subscribe(
      result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
                this.dataSource.data = result.entities;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
            
    });

  }

  getReset(){
    this.filter={};
    this.getFilter();
  }

  


  getInsurance(){
    this.loading = true;
    this.insuranceService.getInsurance().subscribe(
      result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
                this.dataSource.data = result.entities;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
            
    });

  }

  

  newInsurance():void {
    this.rowData = {};
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width ='50%';

    dialogConfig.data = {
      insurance: this.rowData,
      vehicles: this.vehicles,
      }
    const detailDialog = this.dialog.open(InsuranceFormComponent, dialogConfig);
    detailDialog.afterClosed().subscribe(result => {
      if(result){
        //console.log("result",result)
        let temData = this.dataSource.data;
        temData.push(result);
        this.dataSource.data = temData;
        this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
      }
    });



/* 
//vehicle service included for newInsurance
    this.rowData= {};
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width ='50%';
      dialogConfig.data = {
        insurance: this.rowData,
      vehicle: this.vehicles,
      
      }
     const detailDialog = this.dialog.open(InsuranceFormComponent, dialogConfig);
     detailDialog.afterClosed().subscribe(result => {
      if(result){
        let temData = this.dataSource.data;
        temData.push(result);
        this.dataSource.data = temData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }); */
}

updateInsurance(row) {
  this.rowData = row;
  const dialogConfig = new MatDialogConfig();
    dialogConfig.width ='50%';

    dialogConfig.data = {
      insurance: this.rowData,
      vehicles: this.vehicles,
      }
    const detailDialog = this.dialog.open(InsuranceFormComponent, dialogConfig);
   detailDialog.afterClosed().subscribe(result => {
    if(result){
      let index = this.dataSource.data.indexOf(result.id);
      let tempData = this.dataSource.data;
      tempData[index] = result;
      this.dataSource.data = tempData;
      this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      //this.getInsurance();
    }

  });

 /*  //vehicle service included for updateInsurance
  this.rowData = row;

  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = this.rowData;
  dialogConfig.data = {
    insurance: this.rowData,
    
    vehicle: this.vehicles,
};;


  dialogConfig.width = '50%';
  const detailDialog = this.dialog.open(InsuranceFormComponent, dialogConfig);
  detailDialog.afterClosed().subscribe(result => {
    if(result) {
      let index = this.dataSource.data.indexOf(result.id);
      let tempData = this.dataSource.data;
      tempData[index] = result;
      this.dataSource.data = tempData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      

    }
  });

 */

}


deleteInsurance(row){
  this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
    disableClose: false
  });

  this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istediğinize emin misiniz?';

  this.confirmDialogRef.afterClosed().subscribe(result => {
      if ( result )
      {
        this.insuranceService.deleteInsurance(row.id).subscribe(
          x=>{
            if(x.meta.isSuccess == true){
              let insuranceTempData = this.dataSource.data.filter(insurance => insurance.id != row.id)
              this.dataSource = new MatTableDataSource(insuranceTempData);
              this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              this.toastr.success('Sigorta geçmişi Silindi.' , 'Başarılı!' , { timeOut: 1500, "progressBar": true }); 
            } else {
              this.toastr.error(x.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
            }
        })     
      }
      this.confirmDialogRef = null;
  });

}

printToExcel(){
  var storedltem=<any>[];
  var printData=<any>[];
  storedltem.push("Id");
/*   storedltem.push("Plaka"); */
  storedltem.push("Sigorta Şirketi");
  storedltem.push("Sigorta Tipi");
  storedltem.push("Poliçe Başlangıç Tarihi");
  storedltem.push("Poliçe Bitiş Tarihi");
  
  printData.push(storedltem);

  this.dataSource.data.forEach(element=>{
    var storedltem=<any>[];
    if(element.id){
      storedltem.push(element.id);
    } 
    else{
      storedltem.push("");

    }
    /* if(element.vehicle.plateNumber){
      storedltem.push(element.vehicle.plateNumber);
    } 
    else{
      storedltem.push("");

    } */
    if(element.insuranceFirm){
      storedltem.push(element.insuranceFirm);
    } 
    else{
      storedltem.push("");

    }
    if(element.insuranceType){
      storedltem.push(element.insuranceType);
    } 
    else{
      storedltem.push("");

    }
    if(element.dateStart){
      storedltem.push(element.dateStart);
    } 
    else{
      storedltem.push("");

    }
    if(element.dateEnd){
      storedltem.push(element.dateEnd);
    } 
    else{
      storedltem.push("");

    }
    
    printData.push(storedltem);
  });

  const ws:XLSX.WorkSheet=XLSX.utils.json_to_sheet(printData);
  const wb:XLSX.WorkBook=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
  XLSX.writeFile(wb,'sigorta.xlsx');


}


processExcelFile(){
  this.loading = true;
    let files = this.excelFile.nativeElement.files;
    let formData = new FormData();
    if (this.excelFile.nativeElement.files[0]) {
        /*
        dosya kontrolü kaldırıldı, tüm browser versiyonlarında sağlıklı çalışmıyor 0 gelebiliyor.
        if (this.excelFile.nativeElement.files[0].type === 'application/vnd.ms-excel' 
        || this.excelFile.nativeElement.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){ */
                if (files.length <= 0 ) {
                    this.loading = false;
                    Swal.fire({
                        title: 'Lütfen excel dosya seçiniz !',
                        confirmButtonText: 'Tamam'
                    });
                } else {
                    let file = files[0];
                    formData.append('selectedFile', file, file.name);
                    console.log("formData",formData)
                    this.insuranceService.uploadExcel(formData).subscribe(x => {
                           
                            var result = JSON.parse(x._body);
                     
                            if(result.meta.isSuccess == true){
                                this.loading = false;
                                this.toastr.success('Aktarım gerçekleştirildi.' , 'Başarılı !' , { timeOut: 1500, "progressBar": true });
                               // this.importExcelOpen = false;
                            }else{
                                this.loading = false;
                                this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
                            }
                    });
                }
        }else{
            this.loading = false;
            this.toastr.error('Lütfen excel dosyası seçiniz' , 'hata!' , { timeOut: 3000, "progressBar": true });
        }
  }

  clearcalcer(){
    this.excelFile =null;
    this.isOpenImport =false;
  }

  getVehicles(){  
    this.loading = true;
    this.vehicleService.getVehicle().subscribe(
      result=>{
          this.loading = false;
          if(result.meta.isSuccess == true){
            this.vehicles = result.entities;
          }else{
            this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
          }
    });

  }
  
}

