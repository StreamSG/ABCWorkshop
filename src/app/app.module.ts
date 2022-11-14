import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OfficeInfoComponent } from './office-info/office-info.component';
import { TouchNGoComponent } from './touch-n-go/touch-n-go.component';

@NgModule({
  declarations: [
    AppComponent,
    OfficeInfoComponent,
    TouchNGoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
