import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import {  WeatherService } from 'src/app/services/weather.service';
import { WeatherAlertResponse } from 'src/app/models/weather-alert.model';
import { interval, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-weather-alert',
  templateUrl: './weather-alert.component.html',
  styleUrls: ['./weather-alert.component.scss']
})
export class WeatherAlertComponent implements OnInit, OnDestroy {
  @Input() weatherAlert: WeatherAlertResponse;
  public showToast: boolean = true; // By default we want to show the toast, but will be changed if the user closes the toast or if new weather alert data is called from the API
  public toastTimeoutBarWidth: number = 100; // Default the bar to 100% width
  private toastTimeoutTime: number = 10000; // Adjustable to make the toast display a shorter or longer amount of time
  private toastTimeoutUpdateInterval: number = 10; // Adjustable to make the shrinking of the timer bar smoother in exchange for more processing power. The smaller the number, the more frequently the bar width will be calculated.
  private toastLifespanEndTime: number;
  private timeoutBarUpdateIntervalSubscription: Subscription;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.subscribeToWeatherService(); // subscribe to updates in the weatherService so we can show the toast in case it was closed
    this.timerToRemoveAlert();
    this.toastLifespanEndTime = new Date().getTime() + this.toastTimeoutTime;

    this.setupIntervalTimer();
  }

  ngOnDestroy(): void {
    this.timeoutBarUpdateIntervalSubscription.unsubscribe();
  }

  /**
   * @description - For use by the close button on the toast, to set the showToast variable to false, triggering the ngClass show to be disabled and hide to be enabled. Replaces data-bs-dismiss as we want to have more control over the show/hide of the toast.
   * @returns {void}
   */
  public onClickCloseToast(): void {
    this.showToast = false; // close the toast
  }

  /**
   * @description - Will subscribe to the weather service such that whenever a new API response is processed, the showToast will be set to true so the new alert will be displayed.
   * @description - Largely for demo purposes, as normally the user wouldn't be able to switch locations on a whim.
   * @returns {void}
   */
  private subscribeToWeatherService(): void {
    this.weatherService.getLoading().subscribe({
      next: (loading: boolean) => {
        if(!loading && this.weatherService.hasSuccessfullyCompleted()) {
          this.showToast = true; // whenever the call method finishes, we want to show the toast
        }
      }
    });
  }

  /**
   * @description - provide timer to hide active alert so as to not persist on view and limit users use of the app
   * @returns {void}
   */
  private timerToRemoveAlert(): void {
    if (this.showToast) {
      setTimeout(() => {
        this.showToast = false;
      }, this.toastTimeoutTime);
    }
  }

  /**
   * @description Will create and subscribe to an interval which will adjust the width of the toast timeout timer bar. Shrinks with the frequency of the variable updateInterval
   * @returns {void}
   */
  private setupIntervalTimer(): void {
    // Figure out how many times the interval will be called in the lifespan of the toast, so we can take() that many times.
    const numberOfTimesToTakeInterval = Math.ceil(this.toastTimeoutTime / this.toastTimeoutUpdateInterval);
    this.timeoutBarUpdateIntervalSubscription = interval(this.toastTimeoutUpdateInterval)
      .pipe( take(numberOfTimesToTakeInterval) )
      .subscribe({
        next: () => {
          const timeLeft = this.toastLifespanEndTime - new Date().getTime();
          // Calculate the percentage of time that the bar should shrink, and convert it to a 0-100 number with 3 decimal places.
          this.toastTimeoutBarWidth = Math.round( timeLeft / this.toastTimeoutTime * 100000 )/1000; 
        }
      });
  }
}
