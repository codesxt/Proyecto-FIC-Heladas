import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { StationsListComponent } from './stations-list.component';
import { StationsListRoutingModule } from './stations-list-routing.module';

@NgModule({
  imports: [
    StationsListRoutingModule,
    ChartsModule,
    CommonModule
  ],
  declarations: [ StationsListComponent ]
})
export class StationsListModule { }
