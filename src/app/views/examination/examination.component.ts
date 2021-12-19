import { Component, OnInit,ViewChild, ElementRef} from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ExaminationFormComponent } from './examination-form/examination-form.component';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { ExaminationService } from 'app/services/examination.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { VehicleService } from 'app/services/vehicle.service';
import { ExaminationInformationFormComponent } from './examination-information-form/examination-information-form.component';
import { property } from 'lodash';




export interface Examination {
  vehicleName: number;
  documentPath: string;
  isSuccess: boolean;
  examinationStart: Date;
  examinationEnd: Date;
  vehicleId:number;
  examinationdate:Date;
  examinationresult:string;
  examinationResultDocument:string;
  brand:string;
  model:string;
  plateNumber:string;


}
@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.scss']
})
export class ExaminationComponent implements OnInit {
  @ViewChild('excelFile', {static:false}) public excelFile: ElementRef;
  @ViewChild('examinationPaginator') examinationPaginator: MatPaginator;
  @ViewChild('informationPaginator') informationPaginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  @ViewChild('informationSort') informationSort: MatSort;
  public filter : any = {};
  public InformationFilter : any = {};
  public isFilterOpen : Boolean = false;
  public isInformationFilterOpen : Boolean = false;
  public isOpenImport : Boolean = false;
  public isInformationOpenImport : Boolean = false;
  public dataSource = new MatTableDataSource<any>([]);
  public dataInformationSource = new MatTableDataSource<any>([]);
  displayedColumns : string[] = ['vehicleType', 'mileage','actions'];
  displayedColumnsInformation : string[] = ['brand','model','plateNumber', 'examinationDate','examinationResult','actions'];
  rowData : any = {};
  previewUrl : any;
  public loading : Boolean = false;
  public data : any [] = [];
  public vehicleTypes : any []= [];
  public vehicles : any []= [];
  
  //confirm delete operation
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  
  private _toasterService: any;
  importExcelOpen: boolean;
  storedItemService: any;

  constructor(
    private vehicleService : VehicleService,
    public dialog: MatDialog,
    private examinationService : ExaminationService,
    private toastr: ToastrService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService) {
      this._fuseTranslationLoaderService.loadTranslations(turkish, english);
      this.filter.warrantyEndDate = new Date();
     }

  ngOnInit(): void {
    //this.dataSource = INSPECTION_DATA;
    this.getData();
    this.getVehicleTypes();
    this.getFilter();
    this.getDataInformation();
    this.getVehicles();
    this.getInformationFilter();
  }
  getData(){
    this.loading = true;
    this.examinationService.getExamination().subscribe(
      result=>{
          this.loading = false;
          if(result.meta.isSuccess == true){
                this.dataSource.data = result.entities;
                this.dataSource.paginator = this.examinationPaginator;
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = (item,property) =>{
                  switch(property){
                    case 'vehicleType' : return item?.vehicleType?.name;
                    default : return item[property];
                  }
                }
          }

    });

  }
  newExamination() {
    this.rowData= {};
    //const dialogRef = this.dialog.open(ExaminationFormComponent, {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width ='50%';
      dialogConfig.data = {
        examination: this.rowData,
      vehicleTypes: this.vehicleTypes,
      
      }
     const detailDialog = this.dialog.open(ExaminationFormComponent, dialogConfig);
     detailDialog.afterClosed().subscribe(result => {
      if(result){
        let temData = this.dataSource.data;
        temData.push(result);
        this.dataSource.data = temData;
        this.dataSource.paginator = this.examinationPaginator;
       this.dataSource.sort = this.sort;
      }
    });
  }

  updateExamination(row) {
    this.rowData = row;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.rowData;
    dialogConfig.data = {
      examination: this.rowData,
      
      vehicleTypes: this.vehicleTypes,
  };;


    dialogConfig.width = '50%';
    const detailDialog = this.dialog.open(ExaminationFormComponent, dialogConfig);
    detailDialog.afterClosed().subscribe(result => {
      if(result) {
        console.log(result)
        let index = this.dataSource.data.indexOf(result.id);
        let tempData = this.dataSource.data;
        tempData[index] = result;
        this.dataSource.data = tempData;
        this.dataSource.paginator = this.examinationPaginator;
        this.dataSource.sort = this.sort;
        

      }
    });
    
  }
  getExamination() {
    throw new Error("Method not implemented.");
  }

  //confirm delete operation
 

  deleteExamination(row){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istediğinize emin misiniz?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if ( result )
      {
        
        this.examinationService.deleteExamination(row.id).subscribe(
          x=>{
            if(x.meta.isSuccess == true){
              let examinationTempData = this.dataSource.data.filter(examination => examination.id != row.id)
              this.dataSource = new MatTableDataSource(examinationTempData);
              this.dataSource.paginator = this.examinationPaginator;
              this.dataSource.sort = this.sort;
              
        
              this.toastr.success('Muayene geçmişi silindi.' , 'Başarılı!' , { timeOut: 1500, "progressBar": true }); 
            } else {
              this.toastr.error(x.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
            }
        })     
      
      }
      this.confirmDialogRef = null;
  });
  }
  

  printToExcelDefinition(){
    var storedltem=<any>[];
    var printData=<any>[];
    storedltem.push("Araç Tipi");
    storedltem.push("Kilometre")
    printData.push(storedltem);

    this.dataSource.data.forEach(element=>{
      var storedltem=<any>[];
      if(element.vehicleType){
        storedltem.push(element.vehicleType.name);
      } 
      else{
        storedltem.push("");

      }
      
      if(element.mileage){
        storedltem.push(element.mileage );
      } 
      else{
        storedltem.push("");

      }
      printData.push(storedltem);
    });

    const ws:XLSX.WorkSheet=XLSX.utils.json_to_sheet(printData);
    const wb:XLSX.WorkBook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    XLSX.writeFile(wb,'muayene.xlsx');


  }
  

  processExcelFileDefinition(){
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
                    this.examinationService.uploadExcel(formData).subscribe(x => {
                           
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
    getVehicleTypes(){  
      this.loading = true;
      this.vehicleService.getVehicleType().subscribe(
        result=>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              this.vehicleTypes = result.entities;
            }else{
              this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
      });

    }

    getFilter(){
      this.loading = true;
      this.examinationService.getFilter(this.filter).subscribe(
        result=>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              this.dataSource.data = result.entities;
              //this.filter = result.entities;
  
            }else{
              this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
  
      });
  
  
    }
    getreset(){
      this.filter ={};
      this.getFilter();
  
  
  
    }

    //examinationinformatıon
  
  getDataInformation(){
    this.loading = true;
    this.examinationService.getExaminationInformation().subscribe(
      result=>{
          this.loading = false;
          if(result.meta.isSuccess == true){
                this.dataInformationSource.data = result.entities;
                this.dataInformationSource.paginator = this.informationPaginator;
                this.dataInformationSource.sort = this.informationSort;
               
        }

    });

  }

  newExaminationInformation() {
    this.rowData= {};
    //const dialogRef = this.dialog.open(InspectionFormComponent, {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width ='50%';
      dialogConfig.data = {
        examination: this.rowData,
      vehicle: this.vehicles,
      
      }
     const detailDialog = this.dialog.open(ExaminationInformationFormComponent, dialogConfig);
     detailDialog.afterClosed().subscribe(result => {
      if(result){
        let temData = this.dataInformationSource.data;
        temData.push(result);
        this.dataInformationSource.data = temData;
        this.dataInformationSource.paginator = this.informationPaginator;
        this.dataInformationSource.sort = this.informationSort;
      }
    });
  }

  updateExaminationInformation(row) {
    this.rowData = row;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.rowData;
    dialogConfig.data = {
      examination: this.rowData,
      
      vehicle: this.vehicles,
  };;


    dialogConfig.width = '50%';
    const detailDialog = this.dialog.open(ExaminationInformationFormComponent, dialogConfig);
    detailDialog.afterClosed().subscribe(result => {
      if(result) {
        let index = this.dataInformationSource.data.indexOf(result.id);
        let tempData = this.dataInformationSource.data;
        tempData[index] = result;
        this.dataInformationSource.data = tempData;
        this.dataInformationSource.paginator = this.informationPaginator;
        this.dataInformationSource.sort = this.informationSort;
        

      }
    });
    
  }
  getExaminationInformation() {
    throw new Error("Method not implemented.");
  }

  //confirm delete operation
 

  deleteExaminationInformation(row){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istediğinize emin misiniz?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if ( result )
      {
        
        this.examinationService.deleteExaminationInformation(row.id).subscribe(
          x=>{
            if(x.meta.isSuccess == true){
              let examinationTempData = this.dataInformationSource.data.filter(examination => examination.id != row.id)
              this.dataInformationSource = new MatTableDataSource(examinationTempData);
              this.dataInformationSource.paginator = this.informationPaginator;
              this.dataInformationSource.sort = this.informationSort;
              
        
              this.toastr.success('Muayene geçmişi silindi.' , 'Başarılı!' , { timeOut: 1500, "progressBar": true }); 
            } else {
              this.toastr.error(x.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
            }
        })     
      
      }
      this.confirmDialogRef = null;
  });
  }
  

  printToExcelInformation(){
    var storedltem=<any>[];
    var printData=<any>[];
    storedltem.push("Id");
    storedltem.push("Plaka");
    storedltem.push("Muayene Sonucu");
    storedltem.push("Muayene Tarihi");
    storedltem.push("Muayene Sonucu Dokümanı")
    printData.push(storedltem);

    this.dataInformationSource.data.forEach(element=>{
      var storedltem=<any>[];
      if(element.id){
        storedltem.push(element.id);
      } 
      else{
        storedltem.push("");

      }
      if(element.vehicle.plateNumber){
        storedltem.push(element.vehicle.plateNumber);
      } 
      else{
        storedltem.push("");

      }
      if(element.examinationResult){
        storedltem.push(element.examinationResult);
      } 
      else{
        storedltem.push("");

      }
      
      if(element.examinationDate){
        storedltem.push(element.examinationDate );
      } 
      else{
        storedltem.push("");

      }
      if(element.examinationResultDocument){
        storedltem.push(element.examinationResultDocument );
      } 
      else{
        storedltem.push("");

      }
      printData.push(storedltem);
    });

    const ws:XLSX.WorkSheet=XLSX.utils.json_to_sheet(printData);
    const wb:XLSX.WorkBook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    XLSX.writeFile(wb,'muayene_bilgileri.xlsx');


  }
  

  processExcelFileInformation(){
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
                    this.examinationService.uploadExcel(formData).subscribe(x => {
                           
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

    clearcalcerInformation(){
      this.excelFile =null;
      this.isInformationOpenImport =false;
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

    getInformationFilter(){
      this.loading = true;
      this.examinationService.getInformationFilter(this.InformationFilter).subscribe(
        result=>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              this.dataInformationSource.data = result.entities;
              //this.filter = result.entities;
  
            }else{
              this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
  
      });
  
  
    }
    getInformaionreset(){
      this.InformationFilter ={};
      this.getInformationFilter();
  
  
  
    }

    
    }
    

    
   
