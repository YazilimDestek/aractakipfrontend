import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { NotificationFormComponent } from './notification-form/notification-form.component'
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { NotificationService } from 'app/services/notification.service';
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



@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers : [MatDialog]
})


export class NotificationComponent implements OnInit {
  @ViewChild('excelFile', {static:false}) public excelFile: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  displayedColumns: string[] = ['name','daysLeft','warningTypeID','warningMethod','description','actions'];
  rowData : any =   {};
  public loading  : Boolean = false;
  public data : any [] = [];
  public isOpenImport : Boolean = false;
  public dataSource = new MatTableDataSource<any>([]);
  public filter : any = {};
  public isFilterOpen : Boolean = false;
  public warningTypes : any [] = [];
  

  // confirm delete operation
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  storedItemService: any;
  private _toasterService: any;
  importExcelOpen: boolean;

    constructor(
      public dialog: MatDialog,
    private notificationService : NotificationService,
    private toastr: ToastrService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService) { 
      this._fuseTranslationLoaderService.loadTranslations(english, turkish);

      
   
    }

    ngOnInit(): void {
      this.getData();
      this.getWarningType();
      this.getFilter();
      //this.data = NOTIFICATIONS_DATA;
      
    
    }

    getFilter(){
      this.loading = true;
      this.notificationService.getFilter(this.filter).subscribe(
        result =>{
              this.loading = false;
              if(result.meta.isSuccess == true){
                  this.dataSource.data = result.entities;
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  this.dataSource.sortingDataAccessor=(item,property)=>{
                    switch(property){
                      case 'warningTypeID' : return item?.warningType?.name;
                      default:return item[property];
                    }
                  }
              }
              
      });
  
    }
  
    getReset(){
      this.filter={};
      this.getFilter();
    }
  

    getData(){
      this.loading = true;
      this.notificationService.getNotification().subscribe(
        result =>{
              this.loading = false;
              if(result.meta.isSuccess == true){
                  this.dataSource.data = result.entities;
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
              }
              
      });
  
    }
  
    newNotification():void {
      /* this.rowData = {};
      const dialogRef = this.dialog.open(NotificationFormComponent, {
        width: '60%',
        data: this.rowData
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          console.log("result",result)
          let temData = this.dataSource.data;
          temData.push(result);
          this.dataSource.data = temData;
          this.dataSource.paginator = this.paginator;
           this.dataSource.sort = this.sort;
        }
      }); */
      this.rowData= {};

      const dialogConfig = new MatDialogConfig();
      dialogConfig.width ='50%';
      dialogConfig.data = {
      notification: this.rowData,
      warningType: this.warningTypes,
      }
     const detailDialog = this.dialog.open(NotificationFormComponent, dialogConfig);
     detailDialog.afterClosed().subscribe(result => {
      if(result){
        let temData = this.dataSource.data;
        temData.push(result);
        this.dataSource.data = temData;
      }
    });
  }
  
  updateNotification(row) {
    this.rowData = row;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      notification: this.rowData,
      warningType: this.warningTypes,
      }
    dialogConfig.data = this.rowData;
    dialogConfig.data = {
      notification: this.rowData,
      
      warningType: this.warningTypes,
  };;


    dialogConfig.width = '50%';
    const detailDialog = this.dialog.open(NotificationFormComponent, dialogConfig);
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
  }
  getNotification() {
    throw new Error("Method not implemented.");
  }
  
  // confirm delete operation
  //confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>; 
  
  deleteNotification(row){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istediğinize emin misiniz?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if ( result )
      {
        
        this.notificationService.deleteNotification(row.id).subscribe(
          x=>{
            if(x.meta.isSuccess == true){
              let notificationTempData = this.dataSource.data.filter(notification => notification.id != row.id)
              this.dataSource = new MatTableDataSource(notificationTempData);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              
        
              this.toastr.success('Uyarı bilgisi silindi.' , 'Başarılı!' , { timeOut: 1500, "progressBar": true }); 
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
    storedltem.push("Uyarı Adı");
    storedltem.push("Kalan Gün");
    storedltem.push("Uyarı Tipi");
    storedltem.push("Uyarı Methodu");
    storedltem.push("Uyarı Tanımı");
    
    printData.push(storedltem);
  
    this.dataSource.data.forEach(element=>{
      var storedltem=<any>[];
      if(element.name){
        storedltem.push(element.name);
      } 
      else{
        storedltem.push("");
  
      }
      if(element.daysLeft){
        storedltem.push(element.daysLeft);
      } 
      else{
        storedltem.push("");
  
      }
      if(element.warningTypeID){
        storedltem.push(element.warningTypeID);
      } 
      else{
        storedltem.push("");
  
      }
      if(element.warningMethod){
        storedltem.push(element.warningMethod);
      } 
      else{
        storedltem.push("");
  
      }
      if(element.description){
        storedltem.push(element.description);
      } 
      else{
        storedltem.push("");
  
      }
      printData.push(storedltem);
    });
  
    const ws:XLSX.WorkSheet=XLSX.utils.json_to_sheet(printData);
    const wb:XLSX.WorkBook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    XLSX.writeFile(wb,'warning.xlsx');
  
  
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
                    this.notificationService.uploadExcel(formData).subscribe(x => {
                           
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
    getWarningType(){
      this.loading = true;
      this.notificationService.getWarningType().subscribe(
         result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
                this.warningTypes= result.entities;
                
            }
    });
    }
  
    
    
  }
  
  