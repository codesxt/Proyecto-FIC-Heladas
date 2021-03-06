import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';

import { SimpleNotificationsModule } from 'angular2-notifications';

// Routing Module
import { AppRoutingModule } from './app.routing';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

// Services
import { FrostService } from './shared/services/frost.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { ProfileService } from './shared/services/profile.service';
import { UsersService } from './shared/services/users.service';
import { HoboStationsService } from './shared/services/hobostations.service';
import { SystemService } from './shared/services/system.service';
import { SubscriptionsService } from './shared/services/subscriptions.service';
import { AgrometService } from './shared/services/agromet.service';
import { MiniStationsService } from './shared/services/ministations.service';
import { AgrometModelsService } from './shared/services/agrometmodels.service';

// Shared Module
import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { NgUploaderModule } from 'ngx-uploader';
import { CalendarModule } from 'angular-calendar';
import * as moment from 'moment';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';
registerLocaleData(localeEsCL);

import { MinistationModalComponent } from './ministations/ministation-modal/ministation-modal.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ChartsModule,
    HttpModule,
    SharedModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBpS9EB53vYadB4EB_bcooT8_e4tK25-Gw'
    }),
    NgUploaderModule,
    CalendarModule.forRoot(),
    LeafletModule.forRoot()
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    SimpleLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    MinistationModalComponent
  ],
  entryComponents: [
    MinistationModalComponent
  ],
  providers: [
    FrostService,
    AuthenticationService,
    ProfileService,
    UsersService,
    HoboStationsService,
    SystemService,
    SubscriptionsService,
    AgrometService,
    MiniStationsService,
    AgrometModelsService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: 'moment', useFactory: (): any => moment
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
