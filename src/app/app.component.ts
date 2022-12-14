import { Component } from '@angular/core';

import { WeatherAlertResponse } from './models/weather-alert.model';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public weatherAlertResponse: WeatherAlertResponse;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    // Subscribe to the weather service so the weather alert toast can be updated when new weather data is pulled
    this.weatherService.getLoading().subscribe({
      next: (loading) => {
        if (!loading && this.weatherService.hasSuccessfullyCompleted()) {
          this.weatherAlertResponse = this.weatherService.getResults();
        }
      }
    });
  }
}
