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

  // filter thru desc to return the WHAT

  ngOnInit(): void {
    this.viewedAlert = this.filterAndShowAlert();
    console.log('viewedAlert', this.viewedAlert)
  }

  private filterAndShowAlert(): WeatherAlert {
    const currentFilteredAlerts: WeatherAlert[] = this.weatherAlerts.filter(alert => {
      if (alert && alert.sent && alert.description && alert.severity && alert.messageType && (alert.severity.includes('Severe') || alert.severity.includes('Extreme') || alert.severity.includes('Moderate')) && !alert.messageType.includes('Cancel')) {
        return alert;
      }
    });
    return currentFilteredAlerts[0];
  }

}
