import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { StationHistoryComponent } from './station-history.component';
import { StationHistoryRoutingModule } from './station-history-routing.module';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    StationHistoryRoutingModule,
    ChartsModule,
    CommonModule,
    SharedModule,
    BsDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ StationHistoryComponent ]
})
export class StationHistoryModule { }
