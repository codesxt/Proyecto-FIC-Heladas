import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PublicHobostationsComponent } from './public-hobostations.component';
import { HoboStationsDataDisplayComponent } from './data-display/datadisplay-hobostations.component';
import { HoboStationsDataExploreComponent } from './data-explore/dataexplore-hobostations.component';

import { PublicHobostationsRoutingModule } from './public-hobostations-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { NgUploaderModule } from 'ngx-uploader';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PublicHobostationsRoutingModule,
    SharedModule,
    NgbModule,
    AgmCoreModule,
    BsDatepickerModule,
    NgUploaderModule,
    ChartsModule
  ],
  declarations: [
    PublicHobostationsComponent,
    HoboStationsDataDisplayComponent,
    HoboStationsDataExploreComponent
  ]
})
export class PublicHobostationsModule { }
