import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { TicketGeneratorComponent } from './components/ticket-generator/ticket-generator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelpComponent } from './components/help/help.component';
import { OfficeInfoComponent } from './components/office-info/office-info.component';
import { TouchNGoComponent } from './components/touch-n-go/touch-n-go.component';
import { WeTrackComponent } from './components/views/we-track/we-track.component';
import { WeTrackItemComponent } from './components/we-track/we-track-item/we-track-item.component';
import { WeTrackListComponent } from './components/we-track/we-track-list/we-track-list.component';
import { WeTrackEditComponent } from './components/we-track/we-track-edit/we-track-edit.component';
import { WeTrackCommentComponent } from './components/we-track/we-track-comment/we-track-comment.component';
import { QcTimerComponent } from './components/qc-timer/qc-timer.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    TicketGeneratorComponent,
    HelpComponent,
    OfficeInfoComponent,
    TouchNGoComponent,
    WeTrackComponent,
    WeTrackItemComponent,
    WeTrackListComponent,
    WeTrackEditComponent,
    WeTrackCommentComponent,
    QcTimerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
