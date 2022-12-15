import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HelpComponent } from './components/help/help.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { TicketGeneratorComponent } from './components/ticket-generator/ticket-generator.component';
import { OfficeInfoComponent } from './components/office-info/office-info.component';
import { WeTrackComponent } from './components/views/we-track/we-track.component';
import { WeTrackListComponent } from './components/we-track/we-track-list/we-track-list.component';
import { WeTrackEditComponent } from './components/we-track/we-track-edit/we-track-edit.component';
import { QcTimerComponent } from './components/qc-timer/qc-timer.component';
import { WeatherViewComponent } from './components/views/weather-view/weather-view.component';

const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  // Mini-projects
  { path: 'touch-n-go', component: OfficeInfoComponent },
  { path: 'ticket-generator', component: TicketGeneratorComponent },
  { path: 'qc-timer', component: QcTimerComponent },
  { path: 'help', component: HelpComponent },
  { path: 'weatherAlert', component: WeatherViewComponent },
  { path: 'we-track', component: WeTrackComponent, children: [
    { path: '', component: WeTrackListComponent },
    { path: 'new', component: WeTrackEditComponent },
    { path: 'edit', component: WeTrackEditComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
