import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AdminPredictionsComponent } from './admin-predictions.component';
import { PredictionsListComponent } from './list/predictions-list.component';
import { PredictionsViewComponent } from './view/predictions-view.component';
import { PredictionsMapComponent } from './map/predictions-map.component';

import { AdminPredictionsRoutingModule } from './admin-predictions-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminPredictionsRoutingModule,
    SharedModule,
    NgbModule,
    AgmCoreModule,
    BsDatepickerModule
  ],
  declarations: [
    AdminPredictionsComponent,
    PredictionsListComponent,
    PredictionsViewComponent,
    PredictionsMapComponent
  ]
})
export class AdminPredictionsModule { }
