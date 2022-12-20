import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, take } from 'rxjs';

import { WeatherAlertInfo, WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import { WeatherService } from 'src/app/services/weather.service';
import * as SafetyJobAids from '../../../safetyJobAids.json';

@Component({
  selector: 'app-weather-view',
  templateUrl: './weather-view.component.html',
  styleUrls: ['./weather-view.component.scss']
})
export class WeatherViewComponent implements OnInit, OnDestroy {
  public weatherAlertResponse: WeatherAlertResponse;
  private ngUnsubscribe = new Subject<void>();
  private safetyJobAids: object;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.subscribeToWeatherService();
    this.safetyJobAids = SafetyJobAids.default;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete
  }

  /**
   * @description - subscribes to weather service and gets api result
   * @returns {void}
   */
  private subscribeToWeatherService(): void {
    this.weatherService.getLoading().pipe(take(2), takeUntil(this.ngUnsubscribe)).subscribe({
       next: (loading: boolean) => {
         if (!loading && this.weatherService.hasSuccessfullyCompleted()) {
           this.weatherAlertResponse = this.weatherService.getResults();
         }
       }
     });
  }

  public doesWeatherAlertRelateToSafetyJobAid(weatherAlert: WeatherAlertInfo): boolean {
    const coldWeatherTags: string[] = ["Ice", "Cold", "Snow", "Winter", "Wind", "Freez", "Blizzard", "Frost"]; // spelling of 'freez' is intentional as the event name from api may say 'freeze' or 'freezing'
    if (Object.keys(weatherAlert) && weatherAlert.event) {
      Object.keys(this.safetyJobAids).forEach(tag => {
        if (weatherAlert.event.indexOf(tag) > -1) {
          console.log(tag)
          console.log(this.safetyJobAids[tag])
        } else
        for (let coldTag of coldWeatherTags) {
          if (weatherAlert.event.indexOf(coldTag) > -1) {
            console.log('cold weather man')
            break
          }
        }
      })
      return true
      // if (this.safetyJobAids.indexOf(weatherAlert.event) > -1) {
      //   console.log('ok')
      // }
    } else {
      return false;
    }
  }

}
