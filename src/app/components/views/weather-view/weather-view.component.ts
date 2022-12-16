import { Component, OnInit } from '@angular/core';

import { WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather-view',
  templateUrl: './weather-view.component.html',
  styleUrls: ['./weather-view.component.scss']
})
export class WeatherViewComponent implements OnInit {
  public weatherAlertResponse: WeatherAlertResponse;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.subscribeToWeatherService();
    console.log(this.weatherAlertResponse)
}

/**
 * @description Subscribes to weather service and returns array for populating view
 * @returns {WeatherAlertResponse}
 */

  private subscribeToWeatherService(): any {
    this.weatherService.getLoading().subscribe({
       next: (loading) => {
         if (!loading && this.weatherService.hasSuccessfullyCompleted()) {
           this.weatherAlertResponse = this.weatherService.getResults();
         }
       }
     });
  }
}
