import { Component, Input, OnInit } from '@angular/core';
import { WeatherAlertInfo, WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import {  WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.scss']
})
export class WeatherAlertComponent implements OnInit {
  @Input() weatherAlerts: WeatherAlertInfo[];
  public viewedAlert: WeatherAlertInfo;

  constructor(private weatherService: WeatherService) { }
W
  ngOnInit(): void {
    // this.viewedAlert = this.filterAndShowAlert();
    // console.log(this.viewedAlert)
    // this.viewedAlert = this.weatherAlerts;
  }

  // private filterAndShowAlert(): WeatherAlert {
  //   let alertForTechView: WeatherAlert;
  //   for (let alert of this.weatherAlerts) {
  //     if (alert && alert.severity && alert.messageType && alert.onset && (alert.severity.includes('Severe') || alert.severity.includes('Moderate')) && !alert.messageType.includes('Cancel')) {
  //       console.log(alert.description.split('*'))
  //       console.log(new Date(alert.onset).getTime() < new Date().getTime())
  //       alertForTechView = alert
  //     }
  //   }
  //   return alertForTechView
  // }

}
