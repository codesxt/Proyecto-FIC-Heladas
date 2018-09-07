import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { MinistationsComponent } from './ministations.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { MapComponent } from './map/map.component';
import { MeasurementsComponent } from './measurements/measurements.component';

import { MinistationsRoutingModule } from './ministations-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { NgUploaderModule } from 'ngx-uploader';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MinistationsRoutingModule,
    SharedModule,
    NgbModule,
    AgmCoreModule,
    LeafletModule,
    NgUploaderModule,
    BsDatepickerModule,
    ChartsModule
  ],
  declarations: [
    MinistationsComponent,
    CreateComponent,
    ListComponent,
    EditComponent,
    MapComponent,
    MeasurementsComponent
  ]
})
export class MinistationsModule { }
