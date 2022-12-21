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
   * @description - Subscribes to weather service and sets global variable for the api response
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
    let tempTag;
    const coldWeatherTags: string[] = ['Ice', 'Cold', 'Snow', 'Winter', 'Freez', 'Blizzard', 'Frost', 'Wind Chill']; // spelling of 'freez' is intentional as the event name from api may say 'freeze' or 'freezing'
    const tropicalStormTags: string[] = ['Tropical', 'Hurricane'];
    const highWindTags: string[] = ['High Wind', 'Tornado', 'Extreme Wind'];
    const allTags: string[] = [...coldWeatherTags, ...tropicalStormTags, ...highWindTags]
    if (Object.keys(weatherAlert) && weatherAlert.event) {
      for (let tag of allTags) {
        if (weatherAlert.event.includes(tag)) {
          tempTag = tag
          break
        }
      }
      if (coldWeatherTags.includes(tempTag)) {
        tempTag = 'Cold'
      } else if (tropicalStormTags.includes(tempTag)) {
        tempTag = 'Tropical'
      } else if (highWindTags.includes(tempTag)) {
        tempTag = 'Wind'
      }
      console.log(tempTag, this.safetyJobAids[tempTag])
      return true
    } else {
      return false;
    }
  }

}
