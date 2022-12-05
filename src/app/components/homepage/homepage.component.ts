import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.loadWeatherAlerts()
      .then(res => {
        console.log('got weather data');
        console.log(res);
      })
      .catch(err => {
        console.log('failed to get weather data');
        console.error(err);
      });
      
  }

}
