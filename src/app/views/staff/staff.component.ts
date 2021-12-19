import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { StaffFormComponent } from './staff-form/staff-form.component'
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { StaffService } from 'app/services/staff.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { clear } from 'console';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


export interface PeriodicElement {
  name: string;
  surname: string;
  department: string;
  position: string;
  abysCode: string;
  phone: string;
  isTrackingEnable: boolean;
}

/* const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Ahmet', surname: 'Yıldırım', departmant: 'IT', position : 'Engineer', abyscode: '', phone: '(123) 456-7890', isTrackingEnable : true },
  {name: 'Batur', surname: 'Toprak', departmant: 'IT', position : 'Engineer', abyscode: '', phone: '(123) 456-7890', isTrackingEnable : false },
  {name: 'Selin', surname: 'Korkmaz', departmant: 'IT', position : 'Engineer', abyscode: '', phone: '(123) 456-7890', isTrackingEnable : false },
  {name: 'Fatih', surname: 'Keser', departmant: 'IT', position : 'Engineer', abyscode: '', phone: '(123) 456-7890', isTrackingEnable : true },
  {name: 'Hakan', surname: 'Öznur', departmant: 'IT', position : 'Engineer', abyscode: '', phone: '(123) 456-7890', isTrackingEnable : true },
  {name: 'Gizem', surname: 'Erkoç', departmant: 'IT', position : 'Engineer', abyscode: '', phone: '(123) 456-7890', isTrackingEnable : false }
]; */

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  @ViewChild('excelFile', {static:false}) public excelFile: ElementRef;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public filter : any = {};
  public isFilterOpen : Boolean = false;
  public data : any [] = [];
  rowData : any = {};
  displayedColumns: string[] = ['name', 'surname',  'phone', 'email', 'actions'];
  public loading : Boolean = false;
  public isOpenImport : Boolean = false;
  public dataSource = new MatTableDataSource<any>([]);
  
  

  // confirm delete operation
  
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  storedItemService: any;
  private _toasterService: any;
  importExcelOpen: boolean;

  constructor(
    public dialog: MatDialog,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private staffService : StaffService,
    private toastr: ToastrService) { 
      this._fuseTranslationLoaderService.loadTranslations(english, turkish);
      this.filter.warrantyEndDate = new Date();
    }

  ngOnInit(): void {
    //this.dataSource = ELEMENT_DATA;
    this.getStaff();
    this.getFilter();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getStaff(){
    this.loading = true;
    this.staffService.getStaff().subscribe(
      result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
                this.dataSource.data = result.entities;
                this.dataSource.paginator = this.paginator;
            }
    });
  }

  newStaff(): void {
    this.rowData = {};
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width ='50%';

  dialogConfig.data = this.rowData;
 const detailDialog = this.dialog.open(StaffFormComponent, dialogConfig);
 detailDialog.afterClosed().subscribe(result => {
  if(result){
    let temData = this.dataSource.data;
    temData.push(result);
    this.dataSource.data = temData;
    
  }

});


}

  updateStaff(row) {
    this.rowData = row;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.rowData;
    dialogConfig.width = '50%';

    const detailDialog = this.dialog.open(StaffFormComponent, dialogConfig);
    detailDialog.afterClosed().subscribe(result => {
      if(result){
        let index = this.dataSource.data.indexOf(result.id);
        let tempData = this.dataSource.data;
        tempData[index] = result;
        this.dataSource.data = tempData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.getStaff();
      }

    });
  }

  deleteStaff(row){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istediğinize emin misiniz?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
          this.staffService.deleteStaff(row.id).subscribe(
            x=>{
              if(x.meta.isSuccess == true){
                let staffTempData = this.dataSource.data.filter(staff => staff.id != row.id)
                this.dataSource = new MatTableDataSource(staffTempData);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.toastr.success('Çalışan geçmişi Silindi.' , 'Başarılı!' , { timeOut: 1500, "progressBar": true }); 
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
    storedltem.push("Adı");
    storedltem.push("Soyadı");
    storedltem.push("E-posta");
    storedltem.push("Telefon");
    storedltem.push("Departman");
    storedltem.push("Pozisyon");
    storedltem.push("Abys Kodu");
    storedltem.push("GPS Takibi");
    
    printData.push(storedltem);
    this.dataSource.data.forEach(element=>{
      var storedltem=<any>[];
      if(element.id){
        storedltem.push(element.id);
      }else{
        storedltem.push("");

      }
      if(element.name){
        storedltem.push(element.name);
      }else{
        storedltem.push("");

      }
      if(element.surname){
        storedltem.push(element.surname);
      }else{
        storedltem.push("");

      }
      if(element.email){
        storedltem.push(element.email);
      }else{
        storedltem.push("");

      }
      if(element.phone){
        storedltem.push(element.phone);
      }else{
        storedltem.push("");

      }
      if(element.department){
        storedltem.push(element.department);
      }else{
        storedltem.push("");

      }
      if(element.position){
        storedltem.push(element.position);
      }else{
        storedltem.push("");

      }
      if(element.abysCode){
        storedltem.push(element.abysCode);
      }else{
        storedltem.push("");

      }
      if(element.isTrackingEnable==true){
        storedltem.push("VAR");
      }else{
        storedltem.push("YOK");

      }
      printData.push(storedltem);
    });

    const ws:XLSX.WorkSheet=XLSX.utils.json_to_sheet(printData);
    const wb:XLSX.WorkBook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    XLSX.writeFile(wb,'calısanlar.xlsx');


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
                    this.staffService.uploadExcel(formData).subscribe(x => {
                           
                            var result = JSON.parse(x._body);
                     
                            if(result.meta.isSuccess == true){
                                this.loading = false;
                                this._toasterService.success('Aktarım gerçekleştirildi.' , 'Başarılı !' , { timeOut: 1500, "progressBar": true });
                               // this.importExcelOpen = false;
                            }else{
                                this.loading = false;
                                this._toasterService.error(result.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
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
    getFilter(){
      this.loading = true;
      this.staffService.getFilter(this.filter).subscribe(
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
    
}


  
  