import { Component } from '@angular/core';

import { WeatherAlertResponse } from './models/weather-alert.model';
import {WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public weatherAlertResponse: WeatherAlertResponse;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.call(43.0722,-89.4008); // hard coded to somewhere with several alerts
    this.weatherService.getLoading().subscribe({
      next: (loading) => {
        if (!loading && this.weatherService.hasSuccessfullyCompleted()) {
          console.log(this.weatherService.getResults());
          this.weatherAlertResponse = this.weatherService.getResults();
        }
      }
    });
  }
}
