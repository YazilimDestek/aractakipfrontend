import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { MatDialogConfig ,MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TireFormComponent } from './tire-form/tire-form.component';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { TireService } from 'app/services/tire.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { clear } from 'console';
import { MatTableDataSource } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from 'app/services/vehicle.service';
import { TireHistoryFormComponent } from './tire-history-form/tire-history-form.component';


export interface Tire {
  brand: string;
  modelID: number; //sezon
  patternName: string; //desen - model
  serialNumber: string;
  purchasedDateTime: Date;
  madeYear: number;
  madeWeek: number;
  /* vehicleId: number; */
}

/* const VEHICLE_DATA: Tire[] = [
  {brand: 'Michelin', modelID: null, patternName: "Symmetric", serialNumber: "ZS25D1S5A", purchasedDateTime: null, madeYear: 2019, madeWeek: 6},
  {brand: 'Michelin', modelID: null, patternName: "Asymmetric", serialNumber: "65ZSD2CV4", purchasedDateTime: null, madeYear: 2020, madeWeek: 12},
  {brand: 'Michelin', modelID: null, patternName: "Directional", serialNumber: "OH5FOE8QW", purchasedDateTime: null, madeYear: 2016, madeWeek: 5},
  {brand: 'Michelin', modelID: null, patternName: "Pilot Sport", serialNumber: "12AD4W5DP", purchasedDateTime: null, madeYear: 2017, madeWeek: 3},
  {brand: 'Michelin', modelID: null, patternName: "Asymmetric", serialNumber: "ZXCDA68E7", purchasedDateTime: null, madeYear: 2018, madeWeek: 1},
] */

@Component({
  selector: 'app-tire',
  templateUrl: './tire.component.html',
  styleUrls: ['./tire.component.scss']
})
export class TireComponent implements OnInit {
  @ViewChild('excelFile', {static:false}) public excelFile: ElementRef;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorHistory') paginatorHistory: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  @ViewChild('sortHistory') sortHistory: MatSort;

  public filter : any = {};
  public filterHistory : any = {};
  public isFilterOpen : Boolean = false;
  public isHistoryFilterOpen : Boolean = false;
  public data : any [] = [];
  public vehicles : any []= [];
  public tires : any []= [];
  public tireHistories : any [] = [];
  public loading : Boolean = false;
  isOnVehicle = false;
  rowData : any = {};
  displayedColumns : string [] = ['brand', 'model', 'figure', 'serialNumber', 'rimDiameter', 'width', 'height', 'actions']
  displayedHistoryColumns : string [] = ['tire', 'vehicle','installedDate','removedDate', 'actions']
  public isOpenImport : Boolean = false;
  public dataSource = new MatTableDataSource<any>([]);
  public dataSourceHistory = new MatTableDataSource<any>([]);

  //confirm delete operation
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  storedItemService: any;
  importExcelOpen: boolean;

  //TRANSLATE EKLENECEK
  constructor(
    public dialog: MatDialog,
    private vehicleService : VehicleService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private tireService : TireService,
    private toastrService: ToastrService) { 
      this._fuseTranslationLoaderService.loadTranslations(english, turkish);
      this.filter.warrantyEndDate = new Date();
    }
    
  ngOnInit(): void {
    //this.dataSource = VEHICLE_DATA;
    this.getTires();
    //this.getFilter();
    this.getVehicles();
    this.getTireHistory();
  }
  getTires(){
    this.loading = true;
    this.tireService.getTire().subscribe(
      result=>{
          this.loading = false;
          if(result.meta.isSuccess == true){
                this.dataSource.data= result.entities;
                this.tires = result.entities;
                this.dataSource.paginator = this.paginator;
          }
    });

  }

  newTire(): void{
    this.rowData = {};
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width ='50%';

    dialogConfig.data = this.rowData;
    const detailDialog = this.dialog.open(TireFormComponent, dialogConfig);
    detailDialog.afterClosed().subscribe(result => {
      if(result){
        let temData = this.dataSource.data;
        temData.push(result);
        this.dataSource.data = temData;
        this.dataSource.paginator = this.paginator;
      }

    });
  }
  newTireHistory(): void{
    this.rowData = {};
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width ='50%';

    dialogConfig.data = {
      tireHistory: this.rowData,
      vehicles: this.vehicles,
      tires : this. tires
      }
    const detailDialog = this.dialog.open(TireHistoryFormComponent, dialogConfig);
    detailDialog.afterClosed().subscribe(result => {
      if(result){
        let temHistoryData = this.dataSourceHistory.data;
        temHistoryData.push(result);
        this.dataSourceHistory.data = temHistoryData;
        this.dataSourceHistory.paginator = this.paginatorHistory;
      }

    });
}

  updateTire(row){
    this.rowData = row;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = this.rowData;
    dialogConfig.width = '50%';

    const detailDialog = this.dialog.open(TireFormComponent, dialogConfig);

    detailDialog.afterClosed().subscribe(result => {
      if(result){
        let index = this.dataSource.data.indexOf(result.id);
        let tempData = this.dataSource.data;
        tempData[index] = result;
        this.dataSource.data = tempData;
        this.dataSource.paginator = this.paginator;
       
      }
    });
  }

  deleteTire(row){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istedi??inize emin misiniz?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if ( result )
        {this.tireService.deleteTire(row.id).subscribe(
          x=>{
            if(x.meta.isSuccess == true){
              let tireTempData = this.dataSource.data.filter(tire => tire.id != row.id)
              this.dataSource = new MatTableDataSource(tireTempData);
              this.dataSource.paginator = this.paginator;
              this.toastrService.success('Lastik Silindi.' , 'Ba??ar??l??!' , { timeOut: 1500, "progressBar": true }); 
            } else {
              this.toastrService.error(x.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
            }
        })     
      }
       
        this.confirmDialogRef = null;
    });
  }
  updateTireHistory(row){
    this.rowData = row;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      tireHistory: this.rowData,
      vehicles: this.vehicles,
      tires : this. tires
      }
    dialogConfig.width = '50%';

    const detailDialog = this.dialog.open(TireHistoryFormComponent, dialogConfig);

    detailDialog.afterClosed().subscribe(result => {
      if(result){
        let index = this.dataSourceHistory.data.indexOf(result.id);
        let tempHistoryData = this.dataSourceHistory.data;
        tempHistoryData[index] = result;
        this.dataSourceHistory.data = tempHistoryData;
        this.dataSourceHistory.paginator = this.paginatorHistory;
       
      }
    });
  }

  deleteTireHistory(row){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istedi??inize emin misiniz?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if ( result )
        {this.tireService.deleteTireHistory(row.id).subscribe(
          x=>{
            if(x.meta.isSuccess == true){
              let tireHistoryTempData = this.dataSourceHistory.data.filter(tire => tire.id != row.id)
              this.dataSourceHistory = new MatTableDataSource(tireHistoryTempData);
              this.dataSourceHistory.paginator = this.paginatorHistory;
              this.toastrService.success('Lastik ge??mi??i Silindi.' , 'Ba??ar??l??!' , { timeOut: 1500, "progressBar": true }); 
            } else {
              this.toastrService.error(x.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
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
/*     storedltem.push("Plaka"); */
    storedltem.push("Marka");
    storedltem.push("Model");
    storedltem.push("??ekil");
    storedltem.push("Seri Numaras??");
    storedltem.push("Jant ??ap??");
    storedltem.push("Geni??lik");
    storedltem.push("Uzunluk");
    printData.push(storedltem);
    this.dataSource.data.forEach(element=>{
      var storedltem=<any>[];
      if(element.id){
        storedltem.push(element.id);
      }else{
        storedltem.push("");

      }
      /* if(element.vehicle.plateNumber){
        storedltem.push(element.vehicle.plateNumber);
      }else{
        storedltem.push("");

      } */
      if(element.brand){
        storedltem.push(element.brand);
      }else{
        storedltem.push("");

      }
      if(element.model){
        storedltem.push(element.model);
      }else{
        storedltem.push("");

      }
      if(element.figure){
        storedltem.push(element.figure);
      }else{
        storedltem.push("");

      }
      if(element.serialNumber){
        storedltem.push(element.serialNumber);
      }else{
        storedltem.push("");

      }
      if(element.width){
        storedltem.push(element.width);
      }else{
        storedltem.push("");

      }
      if(element.height){
        storedltem.push(element.height);
      }else{
        storedltem.push("");

      }
      if(element.rimDiameter){
        storedltem.push(element.rimDiameter);
      }else{
        storedltem.push("");

      }
      printData.push(storedltem);
    });

    const ws:XLSX.WorkSheet=XLSX.utils.json_to_sheet(printData);
    const wb:XLSX.WorkBook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    XLSX.writeFile(wb,'Lastik.xlsx');


  }
  

  processExcelFile(){
    this.loading = true;
    let files = this.excelFile.nativeElement.files;
    let formData = new FormData();
    if (this.excelFile.nativeElement.files[0]) {
        /*
        dosya kontrol?? kald??r??ld??, t??m browser versiyonlar??nda sa??l??kl?? ??al????m??yor 0 gelebiliyor.
        if (this.excelFile.nativeElement.files[0].type === 'application/vnd.ms-excel' 
        || this.excelFile.nativeElement.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){ */
                if (files.length <= 0 ) {
                    this.loading = false;
                    Swal.fire({
                        title: 'L??tfen excel dosya se??iniz !',
                        confirmButtonText: 'Tamam'
                    });
                } else {
                    let file = files[0];
                    formData.append('selectedFile', file, file.name);
                    console.log("formData",formData)
                    this.tireService.uploadExcel(formData).subscribe(x => {
                           
                            var result = JSON.parse(x._body);
                     
                            if(result.meta.isSuccess == true){
                                this.loading = false;
                                this.toastrService.success('Aktar??m ger??ekle??tirildi.' , 'Ba??ar??l?? !' , { timeOut: 1500, "progressBar": true });
                               // this.importExcelOpen = false;
                            }else{
                                this.loading = false;
                                this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
                            }
                    });
                }
        }else{
            this.loading = false;
            this.toastrService.error('L??tfen excel dosyas?? se??iniz' , 'hata!' , { timeOut: 3000, "progressBar": true });
        }
    }

    clearcalcer(){
      this.excelFile =null;
      this.isOpenImport =false;
    }
    getFilter(){
      this.loading = true;
      this.tireService.getFilter(this.filter).subscribe(
        result=>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              this.dataSource.data = result.entities;
              //this.filter = result.entities;
  
            }else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
  
      });
  
  
    }
    getFilterTireHistory(){
      this.loading = true;
      this.tireService.getFilterTireHistory(this.filterHistory).subscribe(result =>{
        console.log(result);
      });
    }
    getreset(){
      this.filter ={};
      this.getFilter();
  
  
  
    }
    getVehicles(){  
      this.loading = true;
      this.vehicleService.getVehicle().subscribe(
        result=>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              this.vehicles = result.entities;
            }else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
      });
  
    }
    getTireHistory(){
      this.loading = true;
      this.tireService.getTireHistory().subscribe(result =>{
        this.loading = false;
          if(result.meta.isSuccess == true){
                this.dataSourceHistory.data= result.entities;
                this.tireHistories = result.entities;
                this.dataSourceHistory.paginator = this.paginatorHistory;
          }
      });
    }
    
}