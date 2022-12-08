import { Component, Input, OnInit } from '@angular/core';
import { WeatherAlert, WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.scss']
})
export class WeatherAlertComponent implements OnInit {
  @Input() weatherAlerts: WeatherAlert[];
  public viewedAlert: WeatherAlert;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.viewedAlert = this.filterAndShowAlert();
    console.log(this.viewedAlert)
  }

  private filterAndShowAlert(): WeatherAlert {
    let alertForTechView: WeatherAlert;
    for (let alert of this.weatherAlerts) {
      if (alert && alert.severity && alert.messageType && alert.onset && (alert.severity.includes('Severe') || alert.severity.includes('Moderate')) && !alert.messageType.includes('Cancel')) {
        console.log(alert.description.split('*'))
        console.log(new Date(alert.onset).getTime() < new Date().getTime())
        alertForTechView = alert
      }
    }
    return alertForTechView
  }

}
