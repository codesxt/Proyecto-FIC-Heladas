import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { MyStationsComponent } from './mystations.component';
import { MyStationsRoutingModule } from './mystations-routing.module';

@NgModule({
  imports: [
    MyStationsRoutingModule,
    ChartsModule,
    CommonModule
  ],
  declarations: [ MyStationsComponent ]
})
export class MyStationsModule { }
