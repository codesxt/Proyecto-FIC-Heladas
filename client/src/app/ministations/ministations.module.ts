import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { MinistationsComponent } from './ministations.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
//import { StationsAdminMapComponent } from './stations-map.component';

import { MinistationsRoutingModule } from './ministations-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MinistationsRoutingModule,
    SharedModule,
    NgbModule,
    AgmCoreModule,
    LeafletModule
  ],
  declarations: [
    MinistationsComponent,
    CreateComponent,
    ListComponent,
    EditComponent,
    //StationDetailsComponent,
    //StationsAdminMapComponent
  ]
})
export class MinistationsModule { }
