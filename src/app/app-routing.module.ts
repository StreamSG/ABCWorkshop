import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HelpComponent } from './components/views/help/help.component';
import { HomepageComponent } from './components/views/homepage/homepage.component';
import { TicketGeneratorComponent } from './components/views/ticket-generator/ticket-generator.component';
import { OfficeInfoComponent } from './components/views/office-info/office-info.component';
import { WeTrackComponent } from './components/views/we-track/we-track.component';
import { WeTrackListComponent } from './components/we-track/we-track-list/we-track-list.component';
import { WeTrackEditComponent } from './components/we-track/we-track-edit/we-track-edit.component';
import { QcTimerComponent } from './components/views/qc-timer/qc-timer.component';
import { JobViewComponent } from './components/views/job-view/job-view.component';
import { JobSubviewComponent } from './components/views/job-view/subviews/job-subview/job-subview.component';
import { CustomerSubviewComponent } from './components/views/job-view/subviews/customer-subview/customer-subview.component';
import { HistorySubviewComponent } from './components/views/job-view/subviews/history-subview/history-subview.component';
import { FacilitiesSubviewComponent } from './components/views/job-view/subviews/facilities-subview/facilities-subview.component';
import { TestsSubviewComponent } from './components/views/job-view/subviews/tests-subview/tests-subview.component';
import { WeatherViewComponent } from './components/views/weather-view/weather-view.component';
import { LoginViewComponent } from './components/views/login-view/login-view.component';

const routes: Routes = [
  { path: '', component: LoginViewComponent, pathMatch: 'full' },
  { path: 'login', component: LoginViewComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'job', component: JobViewComponent, children: [
    { path: '', component: JobSubviewComponent },
    { path: 'customer', component: CustomerSubviewComponent },
    { path: 'history', component: HistorySubviewComponent },
    { path: 'facilities', component: FacilitiesSubviewComponent },
    { path: 'tests', component: TestsSubviewComponent }
  ]},
  // Mini-projects
  { path: 'touch-n-go', component: OfficeInfoComponent },
  { path: 'ticket-generator', component: TicketGeneratorComponent },
  { path: 'qc-timer', component: QcTimerComponent },
  { path: 'help', component: HelpComponent },
  { path: 'weather', component: WeatherViewComponent },
  { path: 'we-track', component: WeTrackComponent, children: [
    { path: '', component: WeTrackListComponent },
    { path: 'new', component: WeTrackEditComponent },
    { path: 'edit', component: WeTrackEditComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
