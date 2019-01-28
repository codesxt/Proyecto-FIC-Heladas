import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { StationComponent } from './station.component';
import { StationRoutingModule } from './station-routing.module';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    StationRoutingModule,
    ChartsModule,
    CommonModule,
    SharedModule
  ],
  declarations: [ StationComponent ]
})
export class StationModule { }
