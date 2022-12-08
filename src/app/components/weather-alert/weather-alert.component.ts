import { Component, OnInit } from '@angular/core';
import { WeatherAlert, WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.scss']
})
export class WeatherAlertComponent implements OnInit {

  public weatherAlerts: WeatherAlert[];

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.loadWeatherAlerts()
    .then(res => {
      console.log('got weather data');
      console.log(res);
      this.weatherAlerts = res;
    })
    .catch(err => {
      console.log('failed to get weather data');
      console.error(err);
    });
}
  }
