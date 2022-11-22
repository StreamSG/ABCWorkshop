import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { HelpComponent } from './components/help/help.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { TicketGeneratorComponent } from './components/ticket-generator/ticket-generator.component';
import { OfficeInfoComponent } from './components/office-info/office-info.component';
import { HelpViewComponent } from './views/help-view/help-view.component';
import { SoiViewComponent } from './views/soi-view/soi-view.component';

const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'office-info', component: OfficeInfoComponent, data: {title: 'Office Info', isDropdown: true} },
  { path: 'ticket-generator', component: TicketGeneratorComponent, data: {title: 'Ticket Generator', isDropdown: true} },
  // { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpViewComponent, data: {title: 'Help'} },
  { path: 'soi-view', component: SoiViewComponent, data: {title: 'Service Order'} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
