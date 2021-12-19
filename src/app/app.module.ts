import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { ToastrModule } from 'ngx-toastr';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { AppConfig } from './app.config';
import { HttpModule } from '@angular/http';
import { VehicleService } from './services/vehicle.service';
import { AuthModule } from './views/auth/auth.module';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';


const appRoutes: Routes = [
    {
      path: 'vehicle',
      loadChildren: () => import('./views/vehicle/vehicle.module').then(m => m.VehicleModule)
    },
    {
        path: 'tire',
        loadChildren: () => import('./views/tire/tire.module').then(m => m.TireModule)
    },
    {
        path: 'staff',
        loadChildren: () => import('./views/staff/staff.module').then(m => m.StaffModule)
    },
    {
        path: 'maintenance',
        loadChildren: () => import('./views/maintenance/maintenance.module').then(m => m.MaintenanceModule)
    },
    {
        path: 'sample',
        loadChildren: () => import('./views/sample/sample.module').then(m => m.SampleModule)
    },
    {
        path: 'notification',
        loadChildren: () => import('./views/notification/notification.module').then(m => m.NotificationModule)
    },
    {
        path: 'insurance',
        loadChildren: () => import('./views/insurance/insurance.module').then(m => m.InsuranceModule)
    },
    {
        path: 'examination',
        loadChildren: () => import('./views/examination/examination.module').then(m => m.ExaminationModule)
    },
    {
        path: 'fuel',
        loadChildren: () => import('./views/fuel/fuel.module').then(m => m.FuelModule)
    },



];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),
        HttpModule,

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Toastr
        ToastrModule.forRoot(),
        

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        //AuthModule
    ],
    providers : [
        AppConfig,
        VehicleService,
        {provide: MAT_DATE_LOCALE, useValue: 'tr-TR'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
