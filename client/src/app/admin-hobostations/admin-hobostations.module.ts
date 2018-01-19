import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AdminHoboStationsComponent } from './admin-hobostations.component';
import { StationsCreateComponent } from './stations-create.component';
import { StationsListComponent } from './stations-list.component';
import { StationDetailsComponent } from './station-details.component';
import { StationsAdminMapComponent } from './stations-map.component';
import { AdminHoboStationsManualUploadComponent } from './manual-upload/manual-upload.component';
import { AdminHoboStationsDataDisplayComponent } from './data-display/datadisplay-hobostations.component';

import { AdminHoboStationsRoutingModule } from './admin-hobostations-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { NgUploaderModule } from 'ngx-uploader';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminHoboStationsRoutingModule,
    SharedModule,
    NgbModule,
    AgmCoreModule,
    NgUploaderModule,
    ChartsModule
  ],
  declarations: [
    AdminHoboStationsComponent,
    StationsCreateComponent,
    StationsListComponent,
    StationDetailsComponent,
    StationsAdminMapComponent,
    AdminHoboStationsManualUploadComponent,
    AdminHoboStationsDataDisplayComponent
  ]
})
export class AdminHoboStationsModule { }
