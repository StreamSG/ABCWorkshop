import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { TicketGeneratorComponent } from './components/ticket-generator/ticket-generator.component';
import { HelpComponent } from './components/help/help.component';
import { OfficeInfoComponent } from './components/office-info/office-info.component';
import { TouchNGoComponent } from './components/touch-n-go/touch-n-go.component';
import { HelpViewComponent } from './views/help-view/help-view.component';
import { H2Component } from './components/h2/h2.component';
import { ListGroupComponent } from './components/list-group/list-group.component';
import { SoiViewComponent } from './views/soi-view/soi-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    TicketGeneratorComponent,
    HelpComponent,
    OfficeInfoComponent,
    TouchNGoComponent,
    HelpViewComponent,
    H2Component,
    ListGroupComponent,
    SoiViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
