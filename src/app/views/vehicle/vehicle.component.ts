import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { VehicleFormComponent } from './vehicle-form/vehicle-form.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { VehicleService } from 'app/services/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {

  // paginator, sort definition
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;

  @ViewChild('brandPaginator') brandPaginator: MatPaginator;
  @ViewChild('brandSort') brandSort: MatSort;
  
  @ViewChild('modelPaginator') modelPaginator: MatPaginator;
  @ViewChild('modelSort') modelSort: MatSort;

  @ViewChild('vehicleTypePaginator') vehicleTypePaginator: MatPaginator;
  @ViewChild('vehicleTypeSort') vehicleTypeSort: MatSort;

  @ViewChild('enginePaginator') enginePaginator: MatPaginator;
  @ViewChild('engineSort') engineSort: MatSort;

  @ViewChild('fuelTankPaginator') fuelTankPaginator: MatPaginator;
  @ViewChild('fuelTankSort') fuelTankSort: MatSort;

  @ViewChild('hydraulicTankPaginator') hydraulicTankPaginator: MatPaginator;
  @ViewChild('hydraulicTankSort') hydraulicTankSort: MatSort;


  // data Sources
  public dataSource = new MatTableDataSource<any>([]); // vehicles data
  public brandDataSource = new MatTableDataSource<any>([]); // brands data
  public modelDataSource = new MatTableDataSource<any>([]); // models data
  public vehicleTypeDataSource = new MatTableDataSource<any>([]); // vehicleType data
  public engineDataSource = new MatTableDataSource<any>([]); // engine data
  public fuelTankDataSource = new MatTableDataSource<any>([]); // fuelTank data
  public hydraulicTankDataSource = new MatTableDataSource<any>([]); // hydraulic data

  
  public filter : any = {};
  public isFilterOpen : Boolean = false;
  public isBrandShow : Boolean = false;
  public isModelShow : Boolean = false;
  public isVehicleTypeShow : Boolean = false;
  public isEngineShow : Boolean = false;
  public isFuelTankShow : Boolean = false;
  public isHydraulicTankShow : Boolean = false;
  public editMode : Boolean = false;
  
  public loading : Boolean = false;
  public brands : any []= [];
  public models : any []= [];
  public engines : any []= [];
  public fuelTanks : any []= [];
  public hydraulicTanks : any []= [];
  public vehicleTypes : any []= [];
  public data : any []= [];
  rowData : any =   {};
  displayedColumns: string[] = ['plateNumber','modelYear', 'brand',  'model', 'engine', 'warrantyEndDateTime','isGpsAttached','actions'];
  brandColumns: string[] = ['brand', 'actions'];
  modelColumns: string[] = ['model', 'actions'];
  vehicleTypeColumns: string[] = ['vehicleType', 'subType', 'actions'];
  engineColumns: string[] = ['engine', 'actions'];
  fuelTankColumns: string[] = ['fuelTank', 'actions'];
  hydraulicTankColumns: string[] = ['hydraulicTank', 'actions'];
  // confirm delete operation
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  //// type definition fields /////
  public brand : any = {};
  public model : any = {};
  public vehicleType : any = {};
  public engine : any = {};
  public fuelTank : any = {};
  public hydraulicTank : any = {};

  constructor(
    public dialog: MatDialog,
    private toastrService : ToastrService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private vehicleService : VehicleService
    ) { 
      this._fuseTranslationLoaderService.loadTranslations(english, turkish);
      this.filter.warrantyEndDate = new Date();
    }

  ngOnInit(): void {
    //this.dataSource = ELEMENT_DATA;
    this.getVehicles();
    this.getAllDatas();
    
  }
  getVehicles(){
    this.loading = true;
    this.vehicleService.getVehicleWithFilter(this.filter).subscribe(
      result =>{
        if(result.meta.isSuccess == true){
                this.dataSource.data = result.entities;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
        }
    });
  }
  clearFilter(){
    this.filter = {};
    this.getVehicles();
  }
  getVehicle(){
    this.loading = true;
    this.vehicleService.getVehicle().subscribe(
      result =>{
        this.loading = false;
        if(result.meta.isSuccess == true){
          this.dataSource.data = result.entities;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
        }
      //console.log(result);
    });
  }
  newVehicle(): void {

    const dialogConfig = new MatDialogConfig();

    //dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';

    dialogConfig.data = {
      vehicle: this.rowData,
      brands: this.brands,
      models : this.models,
      engines : this.engines,
      fuelTanks : this.fuelTanks,
      hydraulicTanks : this.hydraulicTanks,
      vehicleTypes : this.vehicleTypes
    };


    const detailDialog = this.dialog.open(VehicleFormComponent, dialogConfig);
    detailDialog.afterClosed().subscribe(result => {
      if(result){
        this.getVehicle()
      }

    });
    
    
  }
  
  updateVehicle(row) {
    this.rowData = row;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      vehicle: this.rowData,
      brands: this.brands,
      models : this.models,
      engines : this.engines,
      fuelTanks : this.fuelTanks,
      hydraulicTanks : this.hydraulicTanks,
      vehicleTypes : this.vehicleTypes
  };;
    dialogConfig.width = '50%';
    const detailDialog = this.dialog.open(VehicleFormComponent, dialogConfig);

    detailDialog.afterClosed().subscribe(result => {
      if(result){
        this.getVehicle();
      }

    });
  }

  deleteVehicle(vehicle){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Silmek istediğinize emin misiniz?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
          this.loading = true;
          this.vehicleService.deleteVehicle(vehicle.id).subscribe(
              result=>{
                this.loading= false;
                if(result.meta.isSuccess == true){
                  this.toastrService.success('Araç silindi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true }); 
                  this.getVehicle();
                } else {
                  this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                }
              }
          ); 
          
        }
        this.confirmDialogRef = null;
    });

  }

  /////// Get Datas ////////
  getAllDatas(){
    this.getBrands();
    this.getModels();
    this.getEngines();
    this.getFuelTanks();
    this.getHydraulicTanks();
    this.getVehicleTypes();
  }

  getBrands(){
    this.loading = true;
    this.vehicleService.getBrand().subscribe(
      result=>{
          this.loading = false;
          if(result.meta.isSuccess == true){
            this.brands = result.entities;
            this.brandDataSource.data = result.entities;
            this.brandDataSource.paginator = this.brandPaginator;
            this.brandDataSource.sort = this.brandSort;
          }else{
            this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
          }

    });

  }
  getModels(){
    this.loading = true;
    this.vehicleService.getModel().subscribe(
      result=>{
          this.loading = false;
          if(result.meta.isSuccess == true){
            this.models = result.entities;
            this.modelDataSource.data = result.entities;
            this.modelDataSource.paginator = this.modelPaginator;
            this.modelDataSource.sort = this.modelSort;
          }else{
            this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
          }

    });

  }
  getEngines(){
    this.loading = true;
    this.vehicleService.getEngine().subscribe(
      result=>{
          this.loading = false;
          if(result.meta.isSuccess == true){
            this.engines = result.entities;
            this.engineDataSource.data = result.entities;
            this.engineDataSource.paginator = this.enginePaginator;
            this.engineDataSource.sort = this.engineSort;
          }else{
            this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
          }

    });

  }
  getFuelTanks(){
    this.loading = true;
    this.vehicleService.getFuelTank().subscribe(
      result=>{
          this.loading = false;
          if(result.meta.isSuccess == true){
            this.fuelTanks = result.entities;
            this.fuelTankDataSource.data = result.entities;
            this.fuelTankDataSource.paginator = this.fuelTankPaginator;
            this.fuelTankDataSource.sort = this.fuelTankSort;
          }else{
            this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
          }

    });

  }
  getHydraulicTanks(){
    this.loading = true;
    this.vehicleService.getHydraulicTank().subscribe(
      result=>{
          this.loading = false;
          if(result.meta.isSuccess == true){
            this.hydraulicTanks = result.entities;
            this.hydraulicTankDataSource.data = result.entities;
            this.hydraulicTankDataSource.paginator = this.hydraulicTankPaginator;
            this.hydraulicTankDataSource.sort = this.hydraulicTankSort;
          }else{
            this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
          }

    });

  }
  getVehicleTypes(){
    this.loading = true;
    this.vehicleService.getVehicleType().subscribe(
      result=>{
          this.loading = false;
          if(result.meta.isSuccess == true){
            this.vehicleTypes = result.entities;
            this.vehicleTypeDataSource.data = result.entities;
            this.vehicleTypeDataSource.paginator = this.vehicleTypePaginator;
            this.vehicleTypeDataSource.sort = this.vehicleTypeSort;
          }else{
            this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
          }
    });

  }
  reset(){
    this.isModelShow = false;
    this.isBrandShow = false;
    this.isVehicleTypeShow = false;
    this.isEngineShow = false;
    this.isFuelTankShow = false;
    this.isHydraulicTankShow = false;
  }
  clickMenuItem(value){
    this.reset();
    if(value=="brand"){
        this.isBrandShow = true;
    } else if(value=="model"){
        this.isModelShow = true;
    }else if(value=="vehicleType"){
      this.isVehicleTypeShow = true;
    }else if(value=="engine"){
      this.isEngineShow = true;
    }else if(value=="fuelTank"){
      this.isFuelTankShow = true;
    }else if(value=="hydraulicTank"){
      this.isHydraulicTankShow = true;
    }
  }

  /////////////// TYPE DEFINITIONS //////////////

// brand operations
  saveBrand(){
    this.loading = true;
    if(this.brand.name){

      if(this.brand.id){

        this.vehicleService.updateBrand(this.brand).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let index = this.brandDataSource.data.findIndex(item => item.id == this.brand.id);
              this.brandDataSource.data[index] = result.entity;
              this.brand = {};
              this.editMode =  false;
              this.toastrService.success('Marka Güncellendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      } else{

        this.vehicleService.createBrand(this.brand).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let tempData = this.brandDataSource.data;
              tempData.push(result.entity);
              this.brandDataSource.data = tempData;
              this.brandDataSource.paginator = this.brandPaginator;
              this.brandDataSource.sort = this.brandSort;
              this.brand = {};
              this.toastrService.success('Marka Eklendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      }

    }else {
      this.toastrService.error('Marka Adı Giriniz', 'Hata !', { timeOut: 2000, "progressBar": true });
    }

  }
  updateBrand(element){
    this.editMode = true;
    this.brand = element;
  }

  deleteBrand(id){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
          this.loading = true;
          this.vehicleService.deleteBrand(id).subscribe(
              result=>{
                this.loading= false;
                if(result.meta.isSuccess == true){
                  let tempData = this.brandDataSource.data.filter(item => item.id != id)
                  this.brandDataSource = new MatTableDataSource(tempData);
                  this.brandDataSource.paginator = this.brandPaginator;
                  this.brandDataSource.sort = this.brandSort;
                  this.toastrService.success('Marka silindi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true });
                } else {
                  this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                }  
              }
          ); 
          
        }
        this.confirmDialogRef = null;
    });
    
  }

  /// model operations

  saveModel(){
    this.loading = true;
    if(this.model.name){

      if(this.model.id){

        this.vehicleService.updateModel(this.model).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let index = this.modelDataSource.data.findIndex(item => item.id == this.model.id);
              this.modelDataSource.data[index] = result.entity;
              this.model = {};
              this.editMode =  false;
              this.toastrService.success('Model Güncellendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      } else{

        this.vehicleService.createModel(this.model).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let tempData = this.modelDataSource.data;
              tempData.push(result.entity);
              this.modelDataSource.data = tempData;
              this.modelDataSource.paginator = this.modelPaginator;
              this.modelDataSource.sort = this.modelSort;
              this.brand = {};
              this.toastrService.success('Model Eklendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      }

    }else{
      this.toastrService.error('Model Adı Giriniz', 'Hata !', { timeOut: 2000, "progressBar": true });
    }

  }
  updateModel(element){
    this.editMode = true;
    this.model = element;
  }

  deleteModel(id){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
          this.loading = true;
          this.vehicleService.deleteModel(id).subscribe(
              result=>{
                this.loading= false;
                if(result.meta.isSuccess == true){
                  let tempData = this.modelDataSource.data.filter(item => item.id != id)
                  this.modelDataSource = new MatTableDataSource(tempData);
                  this.modelDataSource.paginator = this.modelPaginator;
                  this.modelDataSource.sort = this.modelSort;
                  this.toastrService.success('Model silindi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true });
                } else {
                  this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                }  
              }
          ); 
          
        }
        this.confirmDialogRef = null;
    });
    
  }

  /// Vehicle Types

  saveVehicleType(){
    this.loading = true;
    if(this.vehicleType.name){

      if(this.vehicleType.id){

        this.vehicleService.updateVehicleType(this.vehicleType).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let index = this.vehicleTypeDataSource.data.findIndex(item => item.id == this.vehicleType.id);
              this.vehicleTypeDataSource.data[index] = result.entity;
              this.vehicleType = {};
              this.editMode =  false;
              this.toastrService.success('Araç Tipi Güncellendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      } else{

        this.vehicleService.createVehicleType(this.vehicleType).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let tempData = this.vehicleTypeDataSource.data;
              tempData.push(result.entity);
              this.vehicleTypeDataSource.data = tempData;
              this.vehicleTypeDataSource.paginator = this.vehicleTypePaginator;
              this.vehicleTypeDataSource.sort = this.vehicleTypeSort;
              this.vehicleType = {};
              this.toastrService.success('Araç Tipi Eklendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      }

    }else{
      this.toastrService.error('Araç Tipi Giriniz', 'Hata !', { timeOut: 2000, "progressBar": true });
    }

  }
  updateVehicleType(element){
    this.editMode = true;
    this.vehicleType = element;
  }

  deleteVehicleType(id){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
          this.loading = true;
          this.vehicleService.deleteVehicleType(id).subscribe(
              result=>{
                this.loading= false;
                if(result.meta.isSuccess == true){
                  let tempData = this.vehicleTypeDataSource.data.filter(item => item.id != id)
                  this.vehicleTypeDataSource = new MatTableDataSource(tempData);
                  this.vehicleTypeDataSource.paginator = this.vehicleTypePaginator;
                  this.vehicleTypeDataSource.sort = this.vehicleTypeSort;
                  this.toastrService.success('Araç Tipi silindi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true });
                } else {
                  this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                }  
              }
          ); 
          
        }
        this.confirmDialogRef = null;
    });
    
  }

  //Engine

  saveEngine(){
    this.loading = true;
    if(this.engine.name){

      if(this.engine.id){

        this.vehicleService.updateEngine(this.engine).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let index = this.engineDataSource.data.findIndex(item => item.id == this.engine.id);
              this.engineDataSource.data[index] = result.entity;
              this.engine = {};
              this.editMode =  false;
              this.toastrService.success('Motor Güncellendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      } else{

        this.vehicleService.createEngine(this.engine).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let tempData = this.engineDataSource.data;
              tempData.push(result.entity);
              this.engineDataSource.data = tempData;
              this.engineDataSource.paginator = this.enginePaginator;
              this.engineDataSource.sort = this.engineSort;
              this.engine = {};
              this.toastrService.success('Motor Eklendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      }

    }else{
      this.toastrService.error("Motor Adı Giriniz", 'Hata !', { timeOut: 2000, "progressBar": true });
    }

  }
  updateEngine(element){
    this.editMode = true;
    this.engine = element;
  }

  deleteEngine(id){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
          this.loading = true;
          this.vehicleService.deleteEngine(id).subscribe(
              result=>{
                this.loading= false;
                if(result.meta.isSuccess == true){
                  let tempData = this.engineDataSource.data.filter(item => item.id != id)
                  this.engineDataSource = new MatTableDataSource(tempData);
                  this.engineDataSource.paginator = this.enginePaginator;
                  this.engineDataSource.sort = this.engineSort;
                  this.toastrService.success('Motor silindi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true });
                } else {
                  this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                }  
              }
          ); 
          
        }
        this.confirmDialogRef = null;
    });
    
  }

  // Fuel Tank

  saveFuelTank(){
    this.loading = true;
    if(this.fuelTank.name){

      if(this.fuelTank.id){

        this.vehicleService.updateFuelTank(this.fuelTank).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let index = this.fuelTankDataSource.data.findIndex(item => item.id == this.fuelTank.id);
              this.fuelTankDataSource.data[index] = result.entity;
              this.fuelTank = {};
              this.editMode =  false;
              this.toastrService.success('Yakıt Tankı Güncellendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      } else{

        this.vehicleService.createFuelTank(this.fuelTank).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let tempData = this.fuelTankDataSource.data;
              tempData.push(result.entity);
              this.fuelTankDataSource.data = tempData;
              this.fuelTankDataSource.paginator = this.fuelTankPaginator;
              this.fuelTankDataSource.sort = this.fuelTankSort;
              this.fuelTank = {};
              this.toastrService.success('Yakıt Tankı Eklendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      }

    }else {
      this.toastrService.error('Yakıt Tankı Adı Giriniz', 'Hata !', { timeOut: 2000, "progressBar": true });
    }

  }
  updateFuelTank(element){
    this.editMode = true;
    this.fuelTank = element;
  }

  deleteFuelTank(id){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
          this.loading = true;
          this.vehicleService.deleteFuelTank(id).subscribe(
              result=>{
                this.loading= false;
                if(result.meta.isSuccess == true){
                  let tempData = this.fuelTankDataSource.data.filter(item => item.id != id)
                  this.fuelTankDataSource = new MatTableDataSource(tempData);
                  this.fuelTankDataSource.paginator = this.fuelTankPaginator;
                  this.fuelTankDataSource.sort = this.fuelTankSort;
                  this.toastrService.success('Yakıt Tankı silindi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true });
                } else {
                  this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                }  
              }
          ); 
          
        }
        this.confirmDialogRef = null;
    });
    
  }

  // Hydraulic Tank

  saveHydraulicTank(){
    this.loading = true;
    if(this.hydraulicTank.name){

      if(this.hydraulicTank.id){

        this.vehicleService.updateHydraulicTank(this.hydraulicTank).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let index = this.hydraulicTankDataSource.data.findIndex(item => item.id == this.hydraulicTank.id);
              this.hydraulicTankDataSource.data[index] = result.entity;
              this.hydraulicTank = {};
              this.editMode =  false;
              this.toastrService.success('Hidrolik Tankı Güncellendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      } else{

        this.vehicleService.createHydraulicTank(this.hydraulicTank).subscribe(
          result =>{
            this.loading = false;
            if(result.meta.isSuccess == true){
              let tempData = this.hydraulicTankDataSource.data;
              tempData.push(result.entity);
              this.hydraulicTankDataSource.data = tempData;
              this.hydraulicTankDataSource.paginator = this.hydraulicTankPaginator;
              this.hydraulicTankDataSource.sort = this.hydraulicTankSort;
              this.hydraulicTank = {};
              this.toastrService.success('Hidrolik Tankı Eklendi' , 'Başarılı!' , { timeOut: 2000, "progressBar": true }); 
            } else{
              this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
            }
        });

      }

    }else {
      this.toastrService.error('Hidrolik Tankı Adı Giriniz', 'Hata !', { timeOut: 2000, "progressBar": true });
    }

  }
  updateHydraulicTank(element){
    this.editMode = true;
    this.hydraulicTank = element;
  }

  deleteHydraulicTank(id){
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
          this.loading = true;
          this.vehicleService.deleteHydraulicTank(id).subscribe(
              result=>{
                this.loading= false;
                if(result.meta.isSuccess == true){
                  let tempData = this.hydraulicTankDataSource.data.filter(item => item.id != id)
                  this.hydraulicTankDataSource = new MatTableDataSource(tempData);
                  this.hydraulicTankDataSource.paginator = this.hydraulicTankPaginator;
                  this.hydraulicTankDataSource.sort = this.hydraulicTankSort;
                  this.toastrService.success('Hidrolik Tankı silindi.' , 'Başarılı!' , { timeOut: 3000, "progressBar": true });
                } else {
                  this.toastrService.error(result.meta.errorMessage, 'Hata !', { timeOut: 5000, "progressBar": true });
                }  
              }
          ); 
          
        }
        this.confirmDialogRef = null;
    });
    
  }

}
