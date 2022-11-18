import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HelpComponent } from './components/help/help.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { TicketGeneratorComponent } from './components/ticket-generator/ticket-generator.component';
import { OfficeInfoComponent } from './components/office-info/office-info.component';
import { WeTrackComponent } from './components/views/we-track/we-track.component';

const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'office-info', component: OfficeInfoComponent },
  { path: 'ticket-generator', component: TicketGeneratorComponent },
  { path: 'help', component: HelpComponent },
  { path: 'we-track', component: WeTrackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
