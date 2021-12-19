import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuelFormComponent } from './fuel-form/fuel-form.component';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { FuelService } from 'app/services/fuel.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { VehicleService } from 'app/services/vehicle.service';


export interface Fuel {
  vehicleName: string;
  fuelTypeName: string;
  liter: number;
  takingDate: Date;
  takingKilometerHour: number;
}



@Component({
  selector: 'app-fuel',
  templateUrl: './fuel.component.html',
  styleUrls: ['./fuel.component.scss']
})
export class FuelComponent implements OnInit {
  @ViewChild('excelFile', {static:false}) public excelFile: ElementRef;
  @ViewChild(MatPaginator,{static:true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public filter : any = {};
  public isFilterOpen : Boolean = false;
  public data : any [] = [];
  rowData : any = {};
  displayedColumns : string [] = ['vehicleType','fuelTypeName', 'liter', 'takenDate', 'mileage', 'actions'];
  public loading : Boolean = false;
  public isOpenImport : Boolean = false;
  public dataSource = new MatTableDataSource<any>([]);
  public vehicles : any [] = [];
 
  

  //confirm delete operation
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  
  constructor(
    private vehicleService : VehicleService, 
    private fuelService : FuelService,
    private dialog: MatDialog,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private toastrService: ToastrService) { 
      this._fuseTranslationLoaderService.loadTranslations(english, turkish);
      this.filter.takenDate = new Date();
    }
    

    //

  ngOnInit(): void {
    //this.getFuelHistory();
    this.getVehicles();
    this.getFilter();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
  }
  getFuelHistory(){
    this.loading = true;
    this.fuelService.getFuel().subscribe(
      result=>{
        this.loading = false;
          if(result.meta.isSuccess == true){
            this.dataSource.data = result.entities;
          }
    });

  }

  newFuel(): void{
    this.rowData = {};
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '50%';

    dialogConfig.data = {
      fuel: this.rowData,
      vehicle : this.vehicles
    };

    const detailDialog = this.dialog.open(FuelFormComponent, dialogConfig);
    detailDialog.afterClosed().subscribe(result => {
      if(result){
        let tempData = this.dataSource.data;
        tempData.push(result);
        this.dataSource.data = tempData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    });
    
  }
 
  updateFuel(row) {
  
    this.rowData = row;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      fuel : this.rowData,
      vehicle : this.vehicles,
    };
    dialogConfig.width = '50%';

    const detailDialog = this.dialog.open(FuelFormComponent, dialogConfig);

    detailDialog.afterClosed().subscribe(result => {
      if(result) {
        let index = this.dataSource.data.indexOf(result.id);
        let tempData = this.dataSource.data;
        tempData[index] = result;
        this.dataSource.data = tempData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
 
  deleteFuel(fuel) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
  
    this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istediğinize emin misiniz?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if ( result )
      {
        this.fuelService.deleteFuel(fuel.id).subscribe(
          x=>{
            if(x.meta.isSuccess == true){
              let fuelTempData = this.dataSource.data.filter(x => x.id != fuel.id)
              this.dataSource = new MatTableDataSource(fuelTempData);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.toastrService.success('Yakıt geçmişi silindi.' , 'Başarılı!' , { timeOut: 1500, "progressBar": true }); 
            } else {
              this.toastrService.error(x.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
            }
        })     
      
      }
      this.confirmDialogRef = null;
  });
  }
  printToExcel(){
    var fuelHistory=<any>[];
    var printData=<any>[];
    fuelHistory.push("Id");
    fuelHistory.push("Plaka");
    fuelHistory.push("Yakıt Türü");
    fuelHistory.push("Litre");
    fuelHistory.push("Kilometre");
    fuelHistory.push("Satın Alma Tarihi");
   
    printData.push(fuelHistory);

    this.dataSource.data.forEach(element=>{
      var fuelHistory=<any>[];
     
      if(element.id){
        fuelHistory.push(element.id);
      } 
      else{
        fuelHistory.push("");

      }
      if(element.vehicle.plateNumber){
        fuelHistory.push(element.vehicle.plateNumber);
      } 
      else{
        fuelHistory.push("");

      }
      if(element.fuelType){
        fuelHistory.push(element.fuelType);
      } 
      else{
        fuelHistory.push("");

      }
      if(element.liter){
        fuelHistory.push(element.liter );
      } 
      else{
        fuelHistory.push("");

      }
      if(element.mileage){
        fuelHistory.push(element.mileage );
      } 
      else{
        fuelHistory.push("");

      }
      if(element.takenDate){
        fuelHistory.push(element.takenDate);
      } 
      else{
        fuelHistory.push("");

      }
      
      printData.push(fuelHistory);
    });

    const ws:XLSX.WorkSheet=XLSX.utils.json_to_sheet(printData);
    const wb:XLSX.WorkBook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    XLSX.writeFile(wb,'yakıt_gecmisi.xlsx');


  }
  

  processExcelFile(){
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
                    this.fuelService.uploadExcel(formData).subscribe(
                      x => {
                        var x = JSON.parse(x._body);
                            if(x.meta.isSuccess == true){
                                this.loading = false;
                                this.toastrService.success('Aktarım gerçekleştirildi.' , 'Başarılı !' , { timeOut: 1500, "progressBar": true }); 
                            }else{
                                this.loading = false;
                                this.toastrService.error(x.meta.errorMessage, 'Hata !', { timeOut: 3000, "progressBar": true });
                            }
                    });
                }
        }else{
            this.loading = false;
            this.toastrService.error('Lütfen excel dosyası seçiniz' , 'Hata !' , { timeOut: 3000, "progressBar": true });
        }
  }

  clearcalcer(){
    this.excelFile =null;
    this.isOpenImport =false;
  }
  getVehicles(){
    this.loading = true;
    this.vehicleService.getVehicle().subscribe(
      result =>{
          this.loading = false;
          if(result.meta.isSuccess == true){
            this.vehicles = result.entities;
          }else{
            this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 2000, "progressBar": true });
          }
    });


  }
  getFilter(){
    this.loading = true;
    this.fuelService.getFilter(this.filter).subscribe(
      result=>{
          this.loading = false;
          if(result.meta.isSuccess == true){
            this.dataSource.data = result.entities;
            //this.filter = result.entities;

          }else{
            this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
          }
          this.dataSource.sort = this.sort;
                this.dataSource.sortingDataAccessor = (item,property) =>{
                  switch(property){
                    //case 'vehicleType' : return item?.vehicleType?.name;
                    case 'fuelTypeName' : return item?.fuelType;
                    default : return item[property];
                  }
                }

    });


  }
  getreset(){
    this.filter ={};
    this.getFilter();



  }
 
    
}




