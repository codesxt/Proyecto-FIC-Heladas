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

// Shared Module
import { SharedModule } from './shared/shared.module';

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
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    SimpleLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective
  ],
  providers: [
    FrostService,
    AuthenticationService,
    ProfileService, {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
