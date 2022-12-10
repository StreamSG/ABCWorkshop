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
    // Removing this for now, as it is implemented into the homepage location switcher box
    // this.weatherService.call(43.0722,-89.4008); // hard coded to somewhere with several alerts
    
    // Subscribe to the weather service so the weather alert toast can be updated when new weather data is pulled
    this.weatherService.getLoading().subscribe({
      next: (loading) => {
        if (!loading && this.weatherService.hasSuccessfullyCompleted()) {
          console.log(this.weatherService.getResults()); // TODO - remove console.log, for testing purposes
          this.weatherAlertResponse = this.weatherService.getResults();
        }
      }
    });
  }
}
