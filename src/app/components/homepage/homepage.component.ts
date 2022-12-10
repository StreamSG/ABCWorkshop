import { Component, OnInit } from '@angular/core';

import { WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public weatherAlertResponse: WeatherAlertResponse;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.call(43.0722,-89.4008); // hard coded to somewhere with several alerts
    this.weatherService.getLoading().subscribe({
      next: (loading) => {
        if(!loading && this.weatherService.hasSuccessfullyCompleted()) {
          console.log(this.weatherService.getResults());
          this.weatherAlertResponse = this.weatherService.getResults();
        }
      }
    });
  }
}
