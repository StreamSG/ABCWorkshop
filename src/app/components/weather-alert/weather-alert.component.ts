import { Component, Input, OnInit } from '@angular/core';
import { WeatherAlertInfo, WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import {  WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.scss']
})
export class WeatherAlertComponent implements OnInit {
  @Input() weatherAlert: WeatherAlertInfo;

  constructor() { }

  ngOnInit(): void {

    if (this.weatherAlert && this.weatherAlert.description && this.weatherAlert.description.indexOf('WHAT') > -1 && this.weatherAlert.description.indexOf('WHERE') && this.weatherAlert.description.indexOf('WHEN') && this.weatherAlert.description.indexOf('IMPACTS')) {
      // this.weatherAlert.description = '';

    }
  }


}
