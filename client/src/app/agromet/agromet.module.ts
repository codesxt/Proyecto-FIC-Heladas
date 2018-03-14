import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AgrometComponent } from './agromet.component';
import { AgrometStationsListComponent } from './agromet-stations/agromet-stations.component';

import { AgrometRoutingModule } from './agromet-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgrometRoutingModule,
    SharedModule,
    NgbModule,
    AgmCoreModule
  ],
  declarations: [
    AgrometComponent,
    AgrometStationsListComponent
  ]
})
export class AgrometModule { }
