import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AgrometComponent } from './agromet.component';
import { AgrometStationsListComponent } from './agromet-stations/agromet-stations.component';
import { AgrometRegisterComponent } from './register/register.component';
import { AgrometListComponent } from './list/list.component';
import { AgrometEditComponent } from './edit/edit.component';
import { AgrometDataManagementComponent } from './data-management/data-management.component';
import { AgrometDataExploreComponent } from './data-explore/dataexplore-agromet.component';

import { AgrometRoutingModule } from './agromet-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { CalendarModule } from 'angular-calendar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgrometRoutingModule,
    SharedModule,
    NgbModule,
    AgmCoreModule,
    ChartsModule,
    CalendarModule.forRoot(),
    BsDatepickerModule
  ],
  declarations: [
    AgrometComponent,
    AgrometStationsListComponent,
    AgrometRegisterComponent,
    AgrometListComponent,
    AgrometEditComponent,
    AgrometDataManagementComponent,
    AgrometDataExploreComponent
  ]
})
export class AgrometModule { }
