import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';

import { WeatherAlertInfo, WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import { WeatherService } from 'src/app/services/weather.service';
import * as safetyJobAids from '../../../safetyJobAids.json';

@Component({
  selector: 'app-weather-view',
  templateUrl: './weather-view.component.html',
  styleUrls: ['./weather-view.component.scss']
})
export class WeatherViewComponent implements OnInit, OnDestroy {
  public weatherAlertResponse: WeatherAlertResponse;
  private ngUnsubscribe = new Subject<void>();
  private safetyJobAids: string = '';

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.subscribeToWeatherService();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private subscribeToWeatherService(): void {
    this.weatherService.getLoading().pipe(take(2), takeUntil(this.ngUnsubscribe)).subscribe((loading: boolean) => {
      if (!loading && this.weatherService.hasSuccessfullyCompleted()) {
        this.weatherAlertResponse = this.weatherService.getResults();
      }
    });
  }

  public doesWeatherAlertRelateToSafetyJobAid(weatherAlert: WeatherAlertInfo): boolean {
    if (Object.keys(weatherAlert) && weatherAlert.event) {
      const tempWeatherString: string = '';
      if (this.eventTypes.indexOf(weatherAlert.event) > -1) {
        console.log('ok')
      }
    } else {
      return false;
    }
  }

}
