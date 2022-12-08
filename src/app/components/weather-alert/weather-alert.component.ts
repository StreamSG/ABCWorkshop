import { Component, Input, OnInit } from '@angular/core';
import { WeatherAlert, WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.scss']
})
export class WeatherAlertComponent implements OnInit {

  @Input() alert: WeatherAlert[];

  public techAlerts: any;

  public weatherAlerts: WeatherAlert[];

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
  // this.filterArray();
  // console.log(this.alert.filter(severity => {

  // }))
}

  // filterArray() {
  //   this.techAlerts = this.alert.slice(0, 3)
  // }
  }
