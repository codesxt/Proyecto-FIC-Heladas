import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AdminStationsComponent } from './admin-stations.component';
import { StationsCreateComponent } from './stations-create.component';
import { StationsListComponent } from './stations-list.component';
import { StationDetailsComponent } from './station-details.component';
import { StationsAdminMapComponent } from './stations-map.component';

import { AdminStationsRoutingModule } from './admin-stations-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminStationsRoutingModule,
    SharedModule,
    NgbModule,
    AgmCoreModule
  ],
  declarations: [
    AdminStationsComponent,
    StationsCreateComponent,
    StationsListComponent,
    StationDetailsComponent,
    StationsAdminMapComponent
  ]
})
export class AdminStationsModule { }
