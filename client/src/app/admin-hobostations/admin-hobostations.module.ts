import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AdminHoboStationsComponent } from './admin-hobostations.component';
import { StationsCreateComponent } from './stations-create.component';
import { StationsListComponent } from './stations-list.component';
import { StationDetailsComponent } from './station-details.component';
import { StationsAdminMapComponent } from './stations-map.component';

import { AdminHoboStationsRoutingModule } from './admin-hobostations-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminHoboStationsRoutingModule,
    SharedModule,
    NgbModule,
    AgmCoreModule
  ],
  declarations: [
    AdminHoboStationsComponent,
    StationsCreateComponent,
    StationsListComponent,
    StationDetailsComponent,
    StationsAdminMapComponent
  ]
})
export class AdminHoboStationsModule { }
