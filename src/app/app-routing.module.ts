import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { TicketGeneratorComponent } from './components/ticket-generator/ticket-generator.component';
import { OfficeInfoComponent } from './office-info/office-info.component';

const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'office-info', component: OfficeInfoComponent },
  { path: 'ticket-generator', component: TicketGeneratorComponent },
  // { path: 'about', component: AboutIDK },
  // { path: 'help', component: HelpIDK },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
