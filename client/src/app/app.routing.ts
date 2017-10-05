import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Heladas'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'station/:id',
        loadChildren: './station/station.module#StationModule'
      },
      {
        path: 'mystations/:id',
        loadChildren: './mystations/mystations.module#MyStationsModule'
      },
      {
        path: 'station-history/:id',
        loadChildren: './station-history/station-history.module#StationHistoryModule'
      },
      {
        path: 'stations-list',
        loadChildren: './stations-list/stations-list.module#StationsListModule'
      }
    ]
  },
  {
    path: 'home',
    component: SimpleLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        loadChildren: './landing/landing.module#LandingModule'
      }
    ]
  },
  {
    path: 'auth',
    component: SimpleLayoutComponent,
    data: {
      title: 'Authentication'
    },
    children: [
      {
        path: '',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
