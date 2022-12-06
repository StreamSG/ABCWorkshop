import { Component, OnInit } from '@angular/core';
import { WeatherAlert, WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public weatherAlerts: WeatherAlert[];

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    // Use this format to handle the weather data. The .then() will receive a variable, here I called it res but you can call it whatever you want
    // That variable will be WeatherAlert[]. So you can loop through that an analyze it.
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
