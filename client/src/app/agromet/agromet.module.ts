import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AgrometComponent } from './agromet.component';
import { AgrometStationsListComponent } from './agromet-stations/agromet-stations.component';

import { AgrometRoutingModule } from './agromet-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgrometRoutingModule,
    SharedModule,
    NgbModule,
    AgmCoreModule,
    ChartsModule
  ],
  declarations: [
    AgrometComponent,
    AgrometStationsListComponent
  ]
})
export class AgrometModule { }
