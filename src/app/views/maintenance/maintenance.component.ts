import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MaintenanceFormComponent } from './maintenance-form/maintenance-form.component';
import { MaintenanceResultFormComponent } from './maintenance-result-form/maintenance-result-form.component';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { MaintenanceService } from 'app/services/maintenance.service';
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
import { FileInput } from 'ngx-material-file-input';

export interface Maintenance {
  
  vehicleName: number,
  maintenanceMileage: number,
  maintenanceType: string,
  rememberDate: Date,
  maintenanceDate: Date,
  vehicleId: number;
  maintenancePath: string;
  plateNumber:string;

}

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  @ViewChild('excelFile', {static:false}) public excelFile: ElementRef;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('resultPaginator') resultPaginator: MatPaginator;
  @ViewChild('resultSort') resultSort: MatSort;
  @ViewChild('sort') sort: MatSort;

  public filter : any = {};
  public resultFilter : any = {};
  public isFilterOpen : Boolean = false;
  public isResultFilterOpen : Boolean = false;
  public data : any [] = [];
  rowData : any = {};
 
  public vehicleTypes: any []= [];
  public vehicles: any [] = [];
  
  displayedColumns : string [] = ['vehicleType', 'maintenanceMileage', 'maintenanceType', 'rememberDate',  'actions'];
  displayedColumnsResult : string [] = ['vehicleBrand', 'maintenanceMileage', 'maintenanceType', 'maintenanceDate',  'actions'];
  
  public loading : Boolean = false;
  public isOpenImport : Boolean = false;
  public isResultOpenImport : Boolean = false;
  public dataSource = new MatTableDataSource<any>([]);
  public dataResultSource = new MatTableDataSource<any>([]);
 
  
  public maintenance: any = {};
  public editMode: Boolean = false;
  public maintenancePath: boolean = false;
  fileData: File = null;
  previewUrl:any = null;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  storedItemService: any;
  private _toasterService: any;
  importExcelOpen: boolean;
 
  constructor(
    private vehicleService : VehicleService,
    private maintenanceService : MaintenanceService,
    public dialog: MatDialog,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private toastr: ToastrService) {
      this._fuseTranslationLoaderService.loadTranslations(english, turkish);
      this.filter.rememberDate = new Date();
      this.resultFilter.maintenanceDate= new Date();
     }

     

  ngOnInit(): void {
  
    this.getVehicles();
    this.getVehicleTypes();
    this.getFilter();
    this.getResultFilter();
    this.getMaintenanceResult();
  }


  getFilter(){
    this.loading = true;
    this.maintenanceService.getFilter(this.filter).subscribe(
      result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
                this.dataSource.data = result.entities;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor=(item,property)=>{
                  switch(property){
                    case 'vehicleType' : return item?.vehicleType?.name;
                    default:return item[property];
                  }
                }
            }
            
    });

  }
  getResultFilter(){
    this.loading = true;
    this.maintenanceService.getResultFilter(this.resultFilter).subscribe(
      result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
                this.dataResultSource.data = result.entities;
                this.dataResultSource.paginator = this.resultPaginator;
                this.dataResultSource.sort = this.resultSort;
                this.dataResultSource.sortingDataAccessor=(item,property)=>{
                  switch(property){
                    case 'vehicleBrand' : return item?.brand?.name;
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

  getResultReset(){
    this.resultFilter={};
    this.getResultFilter();
  }


  getMaintenance(){
    this.loading = true;
    this.maintenanceService.getMaintenance().subscribe(
      result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
                this.dataSource.data = result.entities;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor=(item,property)=>{
                  switch(property){
                    case 'vehicleType' : return item?.vehicleType?.name;
                    default:return item[property];
                  }
                }
            }
    });
  }
  getMaintenanceResult(){
    this.loading = true;
    this.maintenanceService.getMaintenanceResult().subscribe(
      result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
                this.dataResultSource.data = result.entities;
                this.dataResultSource.paginator = this.resultPaginator;
                this.dataResultSource.sort = this.resultSort;
                this.dataResultSource.sortingDataAccessor=(item,property)=>{
                  switch(property){
                    case 'vehicleBrand' : return item?.brand?.name;
                    default:return item[property];
                  }
                }
                
            }
    });
  }

  newMaintenance(): void {
    this.rowData = {};
  
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width ='50%';
  dialogConfig.data = {
    maintenance: this.rowData,
    vehicleType: this.vehicleTypes,
    }



 const detailDialog = this.dialog.open(MaintenanceFormComponent, dialogConfig);
 detailDialog.afterClosed().subscribe(result => {
  if(result){
    let temData = this.dataSource.data;
    temData.push(result);
    this.dataSource.data = temData;
    this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
  }

});


}

newMaintenanceResult(): void {
  this.rowData = {};

const dialogConfig = new MatDialogConfig();
dialogConfig.width ='50%';
dialogConfig.data = {
  maintenance: this.rowData,
  vehicle: this.vehicles
  }

const detailDialog = this.dialog.open(MaintenanceResultFormComponent, dialogConfig);
detailDialog.afterClosed().subscribe(result => {
if(result){
  let temData = this.dataResultSource.data;
  temData.push(result);
  this.dataResultSource.data = temData;
  this.dataResultSource.paginator = this.resultPaginator;
  this.dataResultSource.sort = this.resultSort;
}

});


}

  updateMaintenance(row) {
    this.rowData = row;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.rowData;
    dialogConfig.data = {
      maintenance: this.rowData,
      
      vehicleType: this.vehicleTypes,
  };;

    dialogConfig.width = '50%';

    const detailDialog = this.dialog.open(MaintenanceFormComponent, dialogConfig);
    detailDialog.afterClosed().subscribe(result => {
      if(result){
        let index = this.dataSource.data.indexOf(result.id);
        let tempData = this.dataSource.data;
        tempData[index] = result;
        this.dataSource.data = tempData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    });
  }
  updateMaintenanceResult(row) {
    this.rowData = row;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.rowData;
    dialogConfig.data = {
      maintenance: this.rowData,
      
      vehicle: this.vehicles,
  };;

    dialogConfig.width = '70%';

    const detailDialog = this.dialog.open(MaintenanceResultFormComponent, dialogConfig);
    detailDialog.afterClosed().subscribe(result => {
      if(result){
        let index = this.dataResultSource.data.indexOf(result.id);
        let tempData = this.dataResultSource.data;
        tempData[index] = result;
        this.dataResultSource.data = tempData;
        this.dataResultSource.paginator = this.resultPaginator;
        this.dataResultSource.sort = this.resultSort;
  
      }

    });
  }

  deleteMaintenance(row){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istediğinize emin misiniz?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
          this.maintenanceService.deleteMaintenance(row.id).subscribe(
            x=>{
              if(x.meta.isSuccess == true){
                let maintenanceTempData = this.dataSource.data.filter(maintenance => maintenance.id != row.id)
                this.dataSource = new MatTableDataSource(maintenanceTempData);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.toastr.success('Bakım geçmişi Silindi.' , 'Başarılı!' , { timeOut: 1500, "progressBar": true }); 
              } else {
                this.toastr.error(x.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
              }
          })     
        }
        this.confirmDialogRef = null;
    });

  }

  deleteMaintenanceResult(row){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istediğinize emin misiniz?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
          this.maintenanceService.deleteMaintenanceResult(row.id).subscribe(
            x=>{
              if(x.meta.isSuccess == true){
                let maintenanceTempData = this.dataResultSource.data.filter(maintenance => maintenance.id != row.id)
                this.dataResultSource = new MatTableDataSource(maintenanceTempData);
                this.dataResultSource.paginator = this.resultPaginator;
                this.dataResultSource.sort = this.resultSort;
            
                this.toastr.success('Bakım geçmişi Silindi.' , 'Başarılı!' , { timeOut: 1500, "progressBar": true }); 
              } else {
                this.toastr.error(x.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
              }
          })     
        }
        this.confirmDialogRef = null;
    });

  }


printToExcelResult(){
  var maintenanceResult=<any>[];
  var printData=<any>[];
  maintenanceResult.push("Id");
  maintenanceResult.push("Plaka");
  maintenanceResult.push("Bakım Türü");
  maintenanceResult.push("Kilometre Bakımı");
  maintenanceResult.push("Bakım Tarihi");
 
  
  printData.push(maintenanceResult);

  this.dataResultSource.data.forEach(element=>{
    var maintenanceResult=<any>[];
    if(element.id){
      maintenanceResult.push(element.id);
    } 
    else{
      maintenanceResult.push("");

    }
    if(element.vehicle.plateNumber){
      maintenanceResult.push(element?.vehicle?.plateNumber);
    } 
    else{
      maintenanceResult.push("");

    }
    if(element.maintenanceType){
      maintenanceResult.push(element.maintenanceType);
    } 
    else{
      maintenanceResult.push("");

    }
    if(element.maintenanceMileage){
      maintenanceResult.push(element.maintenanceMileage);
    } 
    else{
      maintenanceResult.push("");

    }
    
    if(element.maintenanceDate){
      maintenanceResult.push(element.maintenanceDate);
    } 
    else{
      maintenanceResult.push("");

    }
    printData.push(maintenanceResult);
  });

  const ws:XLSX.WorkSheet=XLSX.utils.json_to_sheet(printData);
  const wb:XLSX.WorkBook=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
  XLSX.writeFile(wb,'maintenance_result.xlsx');


}


 processExcelFileResult(){
  this.loading = true;
  let files = this.excelFile.nativeElement.files;
  let formData = new FormData();
  if (this.excelFile.nativeElement.files[0]) {
     
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
                  this.maintenanceService.uploadExcel(formData).subscribe(x => {
                          
                          var result = JSON.parse(x._body);
                  
                          if(result.meta.isSuccess == true){
                              this.loading = false;
                              this.toastr.success('Aktarım gerçekleştirildi.' , 'Başarılı !' , { timeOut: 1500, "progressBar": true });
                              //this.importExcelOpen = false;
                          }else{
                              this.loading = false;
                              this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
                          }
                  });
              }
      }else{
          this.loading = false;
          this.toastr.error('Lütfen excel dosyası seçiniz' , 'Hata!' , { timeOut: 3000, "progressBar": true });
      }
  }
 
  clearcalcerResult(){
    this.excelFile =null;
    this.isResultOpenImport =false;
  
  }

  printToExcelDefinition(){
    var maintenanceDefinition=<any>[];
    var printData=<any>[];
    maintenanceDefinition.push("Id");
    maintenanceDefinition.push("Araç Tipi");
    maintenanceDefinition.push("Kilometre Bakımı");
    maintenanceDefinition.push("Bakım Türü");
    maintenanceDefinition.push("Hatırlatma Tarihi");
   
    
    printData.push(maintenanceDefinition);
  
    this.dataSource.data.forEach(element=>{
      var maintenanceDefinition=<any>[];
      if(element.id){
        maintenanceDefinition.push(element.id);
      } 
      else{
        maintenanceDefinition.push("");
  
      }
      if(element.vehicleType){
        maintenanceDefinition.push(element?.vehicleType.name);
      } 
      else{
        maintenanceDefinition.push("");
  
      }
      if(element.maintenanceMileage){
        maintenanceDefinition.push(element.maintenanceMileage);
      } 
      else{
        maintenanceDefinition.push("");
  
      }
      if(element.maintenanceType){
        maintenanceDefinition.push(element.maintenanceType);
      } 
      else{
        maintenanceDefinition.push("");
  
      }
      
      if(element.rememberDate){
        maintenanceDefinition.push(element.rememberDate);
      } 
      else{
        maintenanceDefinition.push("");
  
      }
      printData.push(maintenanceDefinition);
    });
  
    const ws:XLSX.WorkSheet=XLSX.utils.json_to_sheet(printData);
    const wb:XLSX.WorkBook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    XLSX.writeFile(wb,'maintenance_definition.xlsx');
  
  
  }
  
  
   processExcelFileDefinition(){
    this.loading = true;
    let files = this.excelFile.nativeElement.files;
    let formData = new FormData();
    if (this.excelFile.nativeElement.files[0]) {
       
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
                    this.maintenanceService.uploadExcel(formData).subscribe(x => {
                            
                            var result = JSON.parse(x._body);
                    
                            if(result.meta.isSuccess == true){
                                this.loading = false;
                                this.toastr.success('Aktarım gerçekleştirildi.' , 'Başarılı !' , { timeOut: 1500, "progressBar": true });
                                //this.importExcelOpen = false;
                            }else{
                                this.loading = false;
                                this.toastr.error(result.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
                            }
                    });
                }
        }else{
            this.loading = false;
            this.toastr.error('Lütfen excel dosyası seçiniz' , 'Hata!' , { timeOut: 3000, "progressBar": true });
        }
    }
   
    clearcalcerDefinition(){
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

