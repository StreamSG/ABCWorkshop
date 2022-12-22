import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, take } from 'rxjs';

import { SafetyInfo, WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather-view',
  templateUrl: './weather-view.component.html',
  styleUrls: ['./weather-view.component.scss']
})
export class WeatherViewComponent implements OnInit, OnDestroy {
  public weatherAlertResponse: WeatherAlertResponse;
  private ngUnsubscribe = new Subject<void>();
  public modalSafetyInfo: SafetyInfo;


  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.subscribeToWeatherService();
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

  /**
   * @description - sets global variable for use in modal
   * @param {SafetyInfo} safetyInfo - passed safetyinfo to be passed to a modal
   * @returns {void}
   */
  public setSafetyInfoForModal(safetyInfo: SafetyInfo): void {
    this.modalSafetyInfo = safetyInfo;
  }
}
