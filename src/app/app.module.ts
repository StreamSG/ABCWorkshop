import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { TicketGeneratorComponent } from './components/ticket-generator/ticket-generator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HelpComponent } from './components/help/help.component';
import { OfficeInfoComponent } from './components/office-info/office-info.component';
import { TouchNGoComponent } from './components/touch-n-go/touch-n-go.component';
import { WeTrackComponent } from './components/views/we-track/we-track.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    TicketGeneratorComponent,
    HelpComponent,
    OfficeInfoComponent,
    TouchNGoComponent,
    WeTrackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
