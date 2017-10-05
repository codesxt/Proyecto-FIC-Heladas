import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { LandingComponent } from './landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    LandingRoutingModule,
    ChartsModule,
    CommonModule,
    SharedModule
  ],
  declarations: [ LandingComponent ]
})
export class LandingModule { }
